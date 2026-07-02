# MED-ID - Biometric Medical Platform

> **DEMO MVP** - Premium biometric medical identity platform with emergency access

## Architecture Overview

```
med-id/
├── med_id_app/          # Flutter Mobile App (Android APK)
├── admin-panel/         # React + Next.js Admin Panel
├── backend/             # Spring Boot REST API
└── README.md
```

## Quick Start

### Mobile App (Flutter)

```bash
cd med_id_app
flutter pub get
flutter run              # Run on connected device
flutter build apk --debug  # Build APK (already built: build/app/outputs/flutter-apk/app-debug.apk)
```

### Admin Panel (Next.js)

```bash
cd admin-panel
npm install
npm run dev              # http://localhost:3000
npm run build            # Production build
```

### Backend (Spring Boot)

```bash
cd backend
./gradlew bootRun        # http://localhost:8080
# Or run JAR:
java -jar build/libs/med-id-backend-0.0.1-SNAPSHOT.jar
```

## Tech Stack

### Mobile (Flutter)
- **State Management:** Riverpod
- **Architecture:** Clean Architecture
- **Network:** Dio
- **Storage:** Flutter Secure Storage, Hive
- **Routing:** Go Router
- **Biometric:** local_auth (Face ID / Fingerprint)
- **Charts:** fl_chart
- **QR:** qr_flutter, mobile_scanner

### Admin Panel (React/Next.js)
- **Framework:** Next.js 16 + TypeScript
- **UI:** Tailwind CSS + Glassmorphism
- **Charts:** Recharts
- **Animations:** Framer Motion

### Backend (Spring Boot)
- **Language:** Java 21
- **Security:** Spring Security + JWT
- **Database:** PostgreSQL (ready), In-memory (demo)
- **Build:** Gradle

## Demo Credentials

| Role | Login |
|------|-------|
| **Any Phone** | OTP Code: `123456` |
| **Admin** | `admin@medid.com` / any password |
| **Biometric** | Face ID / Fingerprint (simulated) |

## Features

### Mobile App
- Splash Screen with MED-ID logo animation
- Onboarding (3 screens)
- OTP Authentication (demo: any number, code 123456)
- Biometric Login (Face ID / Fingerprint)
- Role Selection (Patient, Doctor, Emergency Staff, Clinic, Admin)
- **Patient Dashboard** with health stats, charts, quick actions
- **Medical Profile** (full CRUD - allergies, medications, diseases, insurance)
- **Documents** (upload, preview, delete, search - PDF/PNG/JPG)
- **Emergency Profile** (limited data for emergency access)
- **Emergency Contacts** (add, edit, delete, call, SMS)
- **Notifications** (push simulation, appointment reminders, alerts)
- **Access Logs** (audit trail with filter and search)
- **QR Code** (unique MED-ID QR, scanner)
- **Admin Panel** (dashboard, users, clinics, doctors, analytics, settings)
- Dark/Light mode
- Glassmorphism design
- Shimmer loading, skeleton states, error/empty states

### Admin Panel
- Dashboard with analytics (1000+ Patients, 250+ Doctors, 100+ Clinics, 500+ Documents)
- Users Management (CRUD)
- Clinics Management (CRUD)
- Doctors Management (CRUD)
- Analytics (Users Growth, Emergency Access, Documents by Type, Roles Distribution)
- Access Logs (filterable, searchable, export)
- Notifications (send, manage)
- Settings (system, security, notification config)
- Dark/Light mode toggle
- Glassmorphism + Framer Motion

### Backend API
- 21+ REST endpoints
- JWT authentication
- In-memory data store (20+ users, 5 clinics, 15 doctors)
- CORS enabled
- CRUD for all entities

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with phone + OTP code |
| POST | `/api/auth/biometric` | Biometric authentication |
| POST | `/api/auth/refresh` | Refresh JWT token |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |

### Medical Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients/{id}/profile` | Get medical profile |
| PUT | `/api/patients/{id}/profile` | Update medical profile |

### Documents
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients/{id}/documents` | List documents |
| POST | `/api/patients/{id}/documents` | Upload document |
| GET | `/api/documents/{id}` | Get document |
| DELETE | `/api/documents/{id}` | Delete document |
| GET | `/api/documents/{id}/download` | Download document |

### Emergency Contacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients/{id}/emergency-contacts` | List contacts |
| POST | `/api/patients/{id}/emergency-contacts` | Add contact |
| PUT | `/api/emergency-contacts/{id}` | Update contact |
| DELETE | `/api/emergency-contacts/{id}` | Delete contact |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications?userId={id}` | Get notifications |
| POST | `/api/notifications` | Send notification |
| PUT | `/api/notifications/{id}/read` | Mark as read |
| DELETE | `/api/notifications/{id}` | Delete notification |

### Access Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/access-logs?userId={id}` | Get user logs |
| GET | `/api/access-logs` | All logs (admin) |
| POST | `/api/access-logs` | Create log entry |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/analytics/users-growth` | Users growth chart data |
| GET | `/api/admin/analytics/emergency-access` | Emergency access chart data |
| GET | `/api/admin/analytics/documents` | Documents chart data |
| GET | `/api/admin/analytics/roles` | Roles distribution data |

### QR
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/qr/{userId}` | Get QR data |
| GET | `/api/qr/scan/{qrData}` | Scan QR → emergency profile |

## Database Schema (PostgreSQL)

### Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50),
    blood_type VARCHAR(10),
    status VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Medical Profiles
```sql
CREATE TABLE medical_profiles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    full_name VARCHAR(255),
    birth_date DATE,
    gender VARCHAR(50),
    blood_type VARCHAR(10),
    allergies TEXT[],
    chronic_diseases TEXT[],
    current_medications TEXT[],
    insurance_provider VARCHAR(255),
    insurance_policy_no VARCHAR(255),
    insurance_expiry DATE,
    updated_at TIMESTAMP
);
```

### Documents
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    patient_id UUID REFERENCES users(id),
    name VARCHAR(255),
    type VARCHAR(100),
    file_size DOUBLE PRECISION,
    notes TEXT,
    uploaded_at TIMESTAMP
);
```

### Emergency Contacts
```sql
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    full_name VARCHAR(255),
    relationship VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    is_primary BOOLEAN
);
```

### Notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255),
    body TEXT,
    type VARCHAR(100),
    is_read BOOLEAN,
    created_at TIMESTAMP
);
```

### Access Logs
```sql
CREATE TABLE access_logs (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    accessed_by VARCHAR(255),
    action VARCHAR(255),
    resource VARCHAR(255),
    ip_address VARCHAR(50),
    accessed_at TIMESTAMP
);
```

## Color Palette

| Token | Color | Hex |
|-------|-------|-----|
| Primary | Blue | `#0F6FFF` |
| Secondary | Green | `#00C896` |
| Background | Light Gray | `#F8FAFC` |
| Emergency | Red | `#FF4D4F` |
| Dark | Dark | `#0D1117` |

## Design System

- **Style:** Minimalistic Medical Premium
- **Effects:** Glassmorphism, Soft Shadows
- **Modes:** Dark / Light
- **Frameworks:** Material 3 + Apple HIG
- **Font:** Inter (Google Fonts)
- **Animations:** Framer Motion (web), Hero/Fade/Slide (mobile)

## Build Outputs

- **APK:** `med_id_app/build/app/outputs/flutter-apk/app-debug.apk`
- **Backend JAR:** `backend/build/libs/med-id-backend-0.0.1-SNAPSHOT.jar`
- **Admin Panel:** `admin-panel/.next/` (production build)

## Security

- JWT token simulation
- Role-based access control (RBAC)
- Biometric authentication (local_auth)
- Flutter Secure Storage for tokens
- Session expiry simulation
- Audit logs for all access
- AES mock encryption
- HTTPS-ready architecture
