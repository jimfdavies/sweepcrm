# **Product Requirements Document (PRD)**

**Project Name:** Chimney Sweep Customer Management System (Desktop Edition) **Target Platform:** Windows Desktop (Developed on macOS) **Primary User:** Administrative Assistant (Non-technical)

## **1\. Project Overview**

A secure, standalone desktop application designed to manage customer contact details, property information, and sweeping history for a UK-based chimney sweep business.  
The system replaces a manual Excel-based workflow. It is designed for **offline, local use** on a single Windows PC. The primary goal is to streamline the monthly data entry of paper forms and generate **mail-merge compatible exports** for physical reminder postcards.

## **2\. Technical Stack & Architecture**

- **Architecture:** Desktop Application (Electron).
- **Frontend:** React (Single Page Application running inside Electron).
- **Backend/IPC:** Electron Main Process (Node.js).
- **Database:** SQLite (Local file-based database).
- **Security:** sqlcipher (or equivalent) for full database encryption at rest.
- **Styling:** Tailwind CSS (recommended for rapid UI development) or standard CSS.
- **Build System:** Electron Builder (Must support compiling a Windows .exe from a macOS development environment).

## **3\. Core Workflows & User Stories**

### **3.1. Authentication & Security**

- **App Launch:** The user is prompted for a master password upon opening the application.
- **Decryption:** The SQLite database is decrypted and opened only after the correct password is provided.
- **Lock:** The application requires the password again if closed and reopened.

### **3.2. Data Entry (The Monthly Admin Task)**

- **Customer Management:**
  - Add, Edit, and Search Customers.
  - Fields: Name (Title, First, Last), Telephone, Email (optional), Notes.
- **Property Management:**
  - A Customer can own **multiple** properties (e.g., Landlords).
  - Fields: Address Line 1, Address Line 2, Town, **Postcode** (UK format validation), Property Notes (e.g., "Access code", "Dog on premises").
- **Job (Sweep) Logging:**
  - Log a completed job against a specific Property.
  - Fields: Date of Sweep, Cost (£), Certificate Number (String/Alphanumeric), Notes (e.g., "Bird nest removed").

### **3.3. The "Killer Feature": Reminder Reporting**

- **Logic:** Identify properties swept roughly 11 months ago (configurable range, e.g., 11-12 months).
- **UI:** A dedicated "Reminders Due" view.
- **Action:** The user can select a month (e.g., "Show me everyone due in November").

### **3.4. Export for Mail Merge**

- **Action:** A "Export to CSV" or "Export to Excel" button on the Reminders view.
- **Output Format:** A flat file suitable for Microsoft Word Mail Merge / Label Printing.
- **Columns Required:** Customer Title, Customer Name, Address Line 1, Town, Postcode, Last Sweep Date.

### **3.5. Backup & Maintenance**

- **Backup:** A prominent "Backup Database" button in settings.
- **Behavior:** Opens a file dialog allowing the user to save a copy of the _encrypted_ .db file to a location of their choice (intended for a Cloud Sync folder like OneDrive/Dropbox).
- **Restore:** Documentation/process to restore the database file if the PC fails.

## **4\. Data Model (Schema Blueprint)**

### **Table: customers**

- id (INTEGER PRIMARY KEY)
- title (TEXT)
- first_name (TEXT)
- last_name (TEXT)
- phone (TEXT)
- email (TEXT)
- created_at (DATETIME)

### **Table: properties**

- id (INTEGER PRIMARY KEY)
- customer_id (INTEGER FOREIGN KEY \-\> customers.id)
- address_line_1 (TEXT)
- address_line_2 (TEXT)
- town (TEXT)
- postcode (TEXT) \- _Crucial for searching_
- notes (TEXT)

### **Table: jobs**

- id (INTEGER PRIMARY KEY)
- property_id (INTEGER FOREIGN KEY \-\> properties.id)
- date*completed (DATE) \- \_Crucial for reminders*
- cost (DECIMAL/INTEGER)
- certificate_number (TEXT)
- notes (TEXT)

## **5\. Non-Functional Requirements**

- **Offline First:** Must function 100% without an internet connection.
- **Performance:** Search results for customers/addresses should be instant.
- **Simplicity:** The UI should be high-contrast and use large, clear buttons. Avoid technical jargon.
- **Installation:** The deliverable must be a single setup file (e.g., ChimneyManager_Setup.exe) with no complex prerequisites.
- **GDPR Compliance:** Features to easily "Forget" (Delete) a customer and all their data upon request.

## **6\. Development Roadmap**

To expedite development, we will implement the database encryption towards the end of the development process. 

1. **Scaffold:** Setup Electron \+ React \+ SQLite boilerplate.
2. **Database:** Implement SQLCipher encryption and connection logic.
3. **CRUD Features:** Build the forms for Customers, Properties, and Jobs.
4. **Reporting:** Build the logic to query "Jobs 11 months old".
5. **Export:** Implement CSV generation.
6. **Packaging:** Configure electron-builder to compile a Windows .exe from the Mac development machine.
