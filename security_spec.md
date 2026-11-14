# Security Specification & Threat Model

## 1. Data Invariants
1. **PII Isolation**: Student names, parent phone numbers, and school names in `program_registrations` and `admission_enquiries` may ONLY be read (`get`, `list`), updated, or deleted by verified academy administrators (`rushikesh.eklavyaa@gmail.com` or an allowlisted email in `admin_emails`).
2. **Strict Public Create Validation**: Visitors submitting registrations or enquiries do not need to sign in, but `create` operations strictly enforce exact schema keys (`hasAll` + `hasOnly`), field types, string length caps, mobile regex (`^[6-9][0-9]{9}$` for registrations, `^[0-9]{10}$` for enquiries), `status == 'new'`, `adminNotes == ''`, and `request.time` server timestamps.
3. **Immutable Audit Trail**: `createdAt` is immutable on update; admins may only mutate `status`, `adminNotes`, and `updatedAt` (`== request.time`).
4. **Email Verification Enforcement**: Admin checks mandate `request.auth.token.email_verified == true` to block unverified email spoofing.
5. **Primary Owner Governance**: Only the verified primary owner (`rushikesh.eklavyaa@gmail.com`) can list, add, or revoke secondary admin accounts in `admin_emails`.
6. **Program Track & Stream Integrity**: `programId` is restricted to `['boards-unlocked', 'blitz', 'finish-line', 'accounts-30', 'accounts-3', 'esat']`, `standard` to `['Std 5', 'Std 6', 'Std 7', 'Std 8', 'Std 9', 'Std 10', 'Std 11', 'Std 12', 'Std 12 (Commerce)']`, and `board` to `['CBSE', 'SSC', 'HSC']`.
7. **Event Gallery Integrity**: `event_posts` contains zero student PII; visitors may read only documents where `isPublished == true`, while create/update/delete require verified `isEventManager()` (`isAdmin()` or verified `enquiry.eklavya@gmail.com`) with strict field schema, `postedBy == request.auth.token.email` identity binding, image URL/data-URI pattern, and 350KB size guard.

## 2. Adversarial Payloads ("Dirty Dozen")
1. **Ghost Field Injection**: Creating a `program_registrations` doc with an extra field `isAdmin: true` -> Rejected by `hasOnly`.
2. **Status Pre-Escalation**: Creating a `program_registrations` doc with `status: 'enrolled'` -> Rejected by `incoming().status == 'new'`.
3. **Timestamp Spoofing**: Creating a registration with a client-forged `createdAt` -> Rejected by `incoming().createdAt == request.time`.
4. **Invalid Mobile Format**: Creating a registration with `parentMobile: '12345'` -> Rejected by regex `^[6-9][0-9]{9}$`.
5. **Oversized String DoW**: Creating a registration with a 5KB `schoolName` -> Rejected by `size() <= 150`.
6. **ID Poisoning**: Creating a document with ID `../../etc/passwd` or 500-char ID -> Rejected by `isValidId()`.
7. **Anonymous PII Scrape (`list`)**: Unauthenticated `getDocs(collection(db, 'program_registrations'))` -> Rejected by `isAdmin()`.
8. **Authenticated Non-Admin PII Read (`get`)**: Signed-in random Gmail user or event-only uploader reading a student's registration -> Rejected by `isAdmin()`.
9. **Unverified Admin Email Spoof**: Token with `email: 'rushikesh.eklavyaa@gmail.com'` and `email_verified: false` -> Rejected by `isVerified()`.
10. **Admin CreatedAt Mutation**: Admin updating `createdAt` or `studentName` -> Rejected by `affectedKeys().hasOnly(['status', 'adminNotes', 'updatedAt'])`.
11. **Privilege Self-Grant**: Non-primary user writing to `admin_emails/{theirEmail}` -> Rejected by `isPrimaryAdmin()`.
12. **Consent Bypass**: Creating a registration with `consentAccepted: false` -> Rejected by `consentAccepted == true`.
13. **Public Event Post Spoofing / Oversized Payload**: Unauthorized user writing to `event_posts`, spoofing `postedBy`, or uploading a `javascript:` URL or >350KB image string -> Rejected by `isEventManager()`, `postedBy` check, and `isValidEventPost()`.
