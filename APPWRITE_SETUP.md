# Appwrite Setup Guide (DEPRECATED)

This document is for a previous version of the `delu.live` application that used an Appwrite backend.

**The current version of this application runs entirely on the frontend using mock data and does not require any Appwrite setup.**

The information below is kept for archival purposes only.

---

## 1. Project and Database

1.  Create a new project in your Appwrite Console.
2.  Go to the **Databases** section and create a new Database.
3.  Copy the **Project ID** and the **Database ID** and paste them into the `metadata.json` file in your project for the `APPWRITE_PROJECT_ID` and `APPWRITE_DATABASE_ID` keys respectively.

## 2. Collections

You need to create the following collections within your database. The **Collection ID** for each must match the values in `metadata.json`.

---

### **`users`**
- **Collection ID**: `users`
- **Attributes**:
    - `name` (string, required)
    - `phone` (string, required)
    - `email` (email, required)
    - `block` (string, required)
    - `profilePhotoUrl` (string, required) - *Will store the Appwrite File ID*
    - `collegeIdUrl` (string, required) - *Will store the Appwrite File ID*
    - `rating` (float, required)
    - `deliveriesCompleted` (integer, required)
    - `walletBalance` (float, required)
    - `isAdmin` (boolean, required)
    - `referralCode` (string, required)
    - `referredByCode` (string)
    - `firstRechargeCompleted` (boolean, required)
    - `usedCouponCodes` (string, size 10000) - *Will store a JSON string*

---

### **`gigs`**
- **Collection ID**: `gigs`
- **Attributes**:
    - `requester` (string, size 10000, required) - *JSON string of `GigUser`*
    - `deliverer` (string, size 10000) - *JSON string of `GigUser`*
    - `parcelInfo` (string, required)
    - `pickupBlock` (string, required)
    - `destinationBlock` (string, required)
    - `price` (float, required)
    - `deliveryDeadline` (datetime, required)
    - `postedAt` (datetime, required)
    - `status` (string, required)
    - `otp` (string, required)
    - `acceptanceSelfieUrl` (string) - *Appwrite File ID*
    - `note` (string)
    - `size` (string)
    - `isUrgent` (boolean)
    - `requesterRating` (integer)
    - `requesterComments` (string)
    - `delivererRating` (integer)
    - `delivererComments` (string)

---

### **`transactions`**
- **Collection ID**: `transactions`
- **Attributes**:
    - `userId` (string, required)
    - `type` (string, required)
    - `amount` (float, required)
    - `description` (string, required)
    - `timestamp` (datetime, required)
    - `relatedGigId` (string)

---

### **`wallet_requests`**
- **Collection ID**: `wallet_requests`
- **Attributes**:
    - `userId` (string, required)
    - `userName` (string, required)
    - `amount` (float, required)
    - `utr` (string, required)
    - `screenshotUrl` (string, required) - *Appwrite File ID*
    - `status` (string, required)
    - `requestedAt` (datetime, required)
    - `couponCode` (string)

---

### **`withdrawal_requests`**
- **Collection ID**: `withdrawal_requests`
- **Attributes**:
    - `userId` (string, required)
    - `userName` (string, required)
    - `amount` (float, required)
    - `upiId` (string, required)
    - `status` (string, required)
    - `requestedAt` (datetime, required)

---

### **`coupons`**
- **Collection ID**: `coupons`
- **Attributes**:
    - `code` (string, required)
    - `bonusPercentage` (float, required)
    - `isActive` (boolean, required)
    - `maxUsesPerUser` (integer, required)

## 3. Storage Buckets

Go to the **Storage** section and create the following buckets. The **Bucket ID** for each must match the values in `metadata.json`.

1.  **`profile_photos`**
    - **Bucket ID**: `profile_photos`
2.  **`college_ids`**
    - **Bucket ID**: `college_ids`
3.  **`payment_screenshots`**
    - **Bucket ID**: `payment_screenshots`

For each bucket, go to the **Settings** tab and under **Permissions**, add a new permission:
- **Role**: `any`
- **Permissions**: `Create`, `Read`

This allows any user (including unauthenticated ones during signup) to upload files. You can tighten these permissions later for enhanced security.
