package com.medid.service;

import com.medid.model.*;
import com.medid.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class MockDataService {

    private final UserRepository userRepository;
    private final MedicalProfileRepository medicalProfileRepository;
    private final DocumentRepository documentRepository;
    private final EmergencyContactRepository emergencyContactRepository;
    private final NotificationRepository notificationRepository;
    private final AccessLogRepository accessLogRepository;
    private final DiagnosisRepository diagnosisRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;
    private final ClinicQueueRepository clinicQueueRepository;
    private final ClinicStaffRepository clinicStaffRepository;
    private final TransactionRepository transactionRepository;
    private final EmergencyAlertRepository emergencyAlertRepository;

    public MockDataService(UserRepository userRepository,
                           MedicalProfileRepository medicalProfileRepository,
                           DocumentRepository documentRepository,
                           EmergencyContactRepository emergencyContactRepository,
                           NotificationRepository notificationRepository,
                           AccessLogRepository accessLogRepository,
                           DiagnosisRepository diagnosisRepository,
                           PrescriptionRepository prescriptionRepository,
                           AppointmentRepository appointmentRepository,
                           ClinicQueueRepository clinicQueueRepository,
                           ClinicStaffRepository clinicStaffRepository,
                           TransactionRepository transactionRepository,
                           EmergencyAlertRepository emergencyAlertRepository) {
        this.userRepository = userRepository;
        this.medicalProfileRepository = medicalProfileRepository;
        this.documentRepository = documentRepository;
        this.emergencyContactRepository = emergencyContactRepository;
        this.notificationRepository = notificationRepository;
        this.accessLogRepository = accessLogRepository;
        this.diagnosisRepository = diagnosisRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.appointmentRepository = appointmentRepository;
        this.clinicQueueRepository = clinicQueueRepository;
        this.clinicStaffRepository = clinicStaffRepository;
        this.transactionRepository = transactionRepository;
        this.emergencyAlertRepository = emergencyAlertRepository;
    }

    @PostConstruct
    public void init() {
        createUsers();
        createProfiles();
        createDocuments();
        createEmergencyContacts();
        createNotifications();
        createAccessLogs();
        createDiagnoses();
        createPrescriptions();
        createAppointments();
        createClinicQueues();
        createClinicStaff();
        createTransactions();
        createEmergencyAlerts();
    }

    private void createUsers() {
        var admin = saveUser("1", "998901234567", "Admin User", "admin@medid.uz", Role.ADMIN);
        var doctor1 = saveUser("2", "998901234568", "Dr. Alisher Karimov", "alisher@medid.uz", Role.DOCTOR);
        var doctor2 = saveUser("3", "998901234569", "Dr. Nilufar Azizova", "nilufar@medid.uz", Role.DOCTOR);
        var doctor3 = saveUser("4", "998901234570", "Dr. Bobur Rahimov", "bobur@medid.uz", Role.DOCTOR);
        var clinic1 = saveUser("5", "998901234571", "City Medical Center", "info@citymed.uz", Role.CLINIC);
        var clinic2 = saveUser("6", "998901234572", "Shifo Health Clinic", "info@shifo.uz", Role.CLINIC);
        var clinic3 = saveUser("7", "998901234573", "Davlat Medical Center", "info@davlat.uz", Role.CLINIC);
        var clinic4 = saveUser("8", "998901234574", "Nur Medical Clinic", "info@nur.uz", Role.CLINIC);
        var clinic5 = saveUser("9", "998901234575", "Hayat Medical Center", "info@hayat.uz", Role.CLINIC);

        var p1 = savePatient("10", "998901234580", "Akmal Toshmatov", "akmal@mail.uz", "A+", "Penicillin", "Asthma", "Emergency contact: brother");
        var p2 = savePatient("11", "998901234581", "Malika Qodirova", "malika@mail.uz", "B+", "None", "Diabetes Type 2", "Take insulin");
        var p3 = savePatient("12", "998901234582", "Javohir Abdullayev", "javohir@mail.uz", "O-", "Sulfa drugs", "Hypertension", "Allergic to sulfa");
        var p4 = savePatient("13", "998901234583", "Sabina Ruzieva", "sabina@mail.uz", "AB+", "Latex", "None", null);
        var p5 = savePatient("14", "998901234584", "Rustam Xolmatov", "rustam@mail.uz", "A-", "Iodine", "Heart disease", "On blood thinners");
        var p6 = savePatient("15", "998901234585", "Dildora Norova", "dildora@mail.uz", "B-", "Aspirin", "Arthritis", null);
        var p7 = savePatient("16", "998901234586", "Sherzod Umarov", "sherzod@mail.uz", "O+", "Peanuts", "None", "Carries EpiPen");
        var p8 = savePatient("17", "998901234587", "Zulfiya Sattarova", "zulfiya@mail.uz", "A+", "None", "Hypothyroidism", "On levothyroxine");
        var p9 = savePatient("18", "998901234588", "Bekzod Tursunov", "bekzod@mail.uz", "AB-", "Codeine", "Epilepsy", null);
        var p10 = savePatient("19", "998901234589", "Nargiza Aliyeva", "nargiza@mail.uz", "O+", "Dust mites", "Migraine", null);
        var p11 = savePatient("20", "998901234590", "Ulug'bek Raximov", "ulugbek@mail.uz", "B+", "None", "None", null);
        var p12 = savePatient("21", "998901234591", "Gulnora Karimova", "gulnora@mail.uz", "O+", "Shellfish", "None", "Allergic to shrimp");
        var p12b = savePatient("22", "998901234592", "Jasur Ahmedov", "jasur@mail.uz", "A+", "None", "Anemia", null);
    }

    private User saveUser(String id, String phone, String name, String email, Role role) {
        var u = new User(id, phone, name, email, "hashed_123", role);
        return userRepository.save(u);
    }

    private User savePatient(String id, String phone, String name, String email,
                              String bloodType, String allergies, String chronicConditions,
                              String emergencyNotes) {
        var u = new User(id, phone, name, email, "hashed_123", Role.PATIENT);
        u.setBloodType(bloodType);
        u.setAllergies(allergies);
        u.setChronicConditions(chronicConditions);
        u.setEmergencyNotes(emergencyNotes);
        return userRepository.save(u);
    }

    private void createProfiles() {
        for (int i = 10; i <= 22; i++) {
            var uid = String.valueOf(i);
            var user = userRepository.findById(uid);
            if (user.isPresent()) {
                var p = new MedicalProfile(String.valueOf(i - 9), uid);
                p.setBloodType(user.get().getBloodType());
                p.setAllergies(user.get().getAllergies());
                p.setChronicConditions(user.get().getChronicConditions());
                p.setEmergencyNotes(user.get().getEmergencyNotes());
                p.setMedications("Sample medications for patient " + i);
                p.setPrimaryPhysician("Dr. Alisher Karimov");
                p.setInsuranceProvider("MedInsurance Co.");
                p.setInsuranceNumber("INS-" + (100000 + i));
                p.setOrganDonor(i % 2 == 0);
                medicalProfileRepository.save(p);
            }
        }
    }

    private void createDocuments() {
        for (int i = 10; i <= 22; i++) {
            var uid = String.valueOf(i);
            var doc = new Document(String.valueOf(i - 9), uid,
                "Blood Test Report " + i,
                DocumentType.LAB_RESULT,
                "Complete blood count analysis", 204800L);
            documentRepository.save(doc);

            if (i % 2 == 0) {
                var doc2 = new Document(String.valueOf(i + 20), uid,
                    "X-Ray Report " + i,
                    DocumentType.XRAY,
                    "Chest X-ray examination", 512000L);
                documentRepository.save(doc2);
            }
        }
    }

    private void createEmergencyContacts() {
        var contacts = new String[][] {
            {"10", "Zarina Toshmatova", "998901234001", "Sister", "1"},
            {"11", "Rustam Qodirov", "998901234002", "Husband", "1"},
            {"12", "Gulnora Abdullayeva", "998901234003", "Wife", "1"},
            {"13", "Dilmurod Ruziev", "998901234004", "Father", "1"},
            {"14", "Malika Xolmatova", "998901234005", "Wife", "1"},
            {"15", "Akmal Norov", "998901234006", "Husband", "1"},
            {"16", "Kamola Umarova", "998901234007", "Mother", "1"},
            {"17", "Oybek Sattarov", "998901234008", "Husband", "1"},
            {"18", "Feruza Tursunova", "998901234009", "Wife", "1"},
            {"19", "Botir Aliyev", "998901234010", "Husband", "1"},
        };
        int seq = 1;
        for (var c : contacts) {
            var ec = new EmergencyContact(String.valueOf(seq), c[0], c[1], c[2], c[3], "1".equals(c[4]));
            emergencyContactRepository.save(ec);
            seq++;
        }
    }

    private void createNotifications() {
        for (int i = 10; i <= 22; i++) {
            var n = new Notification(String.valueOf(i - 9), String.valueOf(i),
                "Appointment Reminder",
                "You have an appointment tomorrow at 10:00 AM with Dr. Karimov",
                NotificationType.APPOINTMENT);
            notificationRepository.save(n);
        }
        for (int i = 10; i <= 22; i += 2) {
            var n = new Notification(String.valueOf(i + 20), String.valueOf(i),
                "Lab Results Ready",
                "Your recent lab results are now available for review",
                NotificationType.INFO);
            notificationRepository.save(n);
        }
    }

    private void createAccessLogs() {
        for (int i = 10; i <= 15; i++) {
            var log = new AccessLog(String.valueOf(i - 9), String.valueOf(i), "2",
                "Medical profile viewed", "192.168.1." + (i - 5));
            log.setTimestamp(LocalDateTime.now().minusDays(i - 9));
            accessLogRepository.save(log);
        }
    }

    private void createDiagnoses() {
        var diagnoses = new Object[][] {
            {"10", "2", "Hypertension", "Stage 1 hypertension, elevated BP", "I10", "2025-12-15"},
            {"11", "2", "Type 2 Diabetes", "Uncontrolled diabetes mellitus", "E11", "2025-12-20"},
            {"12", "2", "Acute Bronchitis", "Cough with sputum production", "J20", "2026-01-05"},
            {"13", "3", "Migraine", "Chronic migraine without aura", "G43", "2026-01-10"},
            {"14", "3", "Osteoarthritis", "Knee joint osteoarthritis", "M17", "2026-01-15"},
            {"15", "2", "Iron Deficiency Anemia", "Low hemoglobin and ferritin", "D50", "2026-01-20"},
            {"16", "3", "Allergic Rhinitis", "Seasonal allergies", "J30", "2026-02-01"},
            {"17", "4", "Hypothyroidism", "Elevated TSH levels", "E03", "2026-02-05"},
            {"18", "4", "Epilepsy", "Generalized tonic-clonic seizures", "G40", "2026-02-10"},
            {"19", "2", "Migraine without aura", "Recurrent headaches", "G43", "2026-02-15"},
        };
        int seq = 1;
        for (var d : diagnoses) {
            var diagnosis = new Diagnosis(String.valueOf(seq), (String) d[0], (String) d[1],
                (String) d[2], (String) d[3], (String) d[4], LocalDate.parse((String) d[5]));
            diagnosisRepository.save(diagnosis);
            seq++;
        }
    }

    private void createPrescriptions() {
        var prescriptions = new Object[][] {
            {"10", "2", "Amlodipine", "5mg", "30 days", "Take once daily", "2025-12-15"},
            {"11", "2", "Metformin", "500mg", "90 days", "Take with meals", "2025-12-20"},
            {"12", "2", "Amoxicillin", "250mg", "7 days", "Take three times daily", "2026-01-05"},
            {"13", "3", "Sumatriptan", "50mg", "10 days", "At onset of migraine", "2026-01-10"},
            {"14", "3", "Ibuprofen", "400mg", "30 days", "As needed for pain", "2026-01-15"},
            {"15", "2", "Ferrous Sulfate", "325mg", "60 days", "Take with vitamin C", "2026-01-20"},
            {"17", "4", "Levothyroxine", "75mcg", "90 days", "Take on empty stomach", "2026-02-05"},
            {"18", "4", "Levetiracetam", "500mg", "30 days", "Twice daily", "2026-02-10"},
        };
        int seq = 1;
        for (var p : prescriptions) {
            var prescription = new Prescription(String.valueOf(seq), (String) p[0], (String) p[1],
                (String) p[2], (String) p[3], (String) p[4], (String) p[5], LocalDate.parse((String) p[6]));
            prescriptionRepository.save(prescription);
            seq++;
        }
    }

    private void createAppointments() {
        var now = LocalDateTime.now();
        var appointments = new Object[][] {
            {"10", "2", "5", now.plusDays(1), Appointment.Status.UPCOMING, "Checkup", "Regular checkup"},
            {"11", "2", "5", now.plusDays(2), Appointment.Status.UPCOMING, "Follow-up", "Diabetes follow-up"},
            {"12", "3", "6", now.plusDays(3), Appointment.Status.UPCOMING, "Consultation", "Heart consultation"},
            {"13", "3", "6", now.minusDays(1), Appointment.Status.COMPLETED, "Checkup", "Annual checkup"},
            {"14", "2", "5", now.minusDays(2), Appointment.Status.COMPLETED, "Surgery", "Knee surgery follow-up"},
            {"15", "4", "7", now.plusDays(4), Appointment.Status.UPCOMING, "Lab Review", "Blood test review"},
            {"16", "2", "5", now.minusDays(3), Appointment.Status.CANCELLED, "Checkup", "Patient cancelled"},
            {"17", "4", "7", now.plusDays(5), Appointment.Status.UPCOMING, "Thyroid Check", "Thyroid panel review"},
            {"18", "3", "6", now.plusDays(6), Appointment.Status.UPCOMING, "Neurology", "Seizure follow-up"},
            {"19", "2", "5", now.minusDays(4), Appointment.Status.COMPLETED, "Migraine Treatment", "Treatment administered"},
            {"10", "3", "6", now.plusDays(7), Appointment.Status.UPCOMING, "Vaccination", "Flu shot"},
            {"11", "4", "7", now.plusDays(8), Appointment.Status.UPCOMING, "Dental", "Dental examination"},
            {"12", "2", "5", now.plusDays(9), Appointment.Status.UPCOMING, "Physiotherapy", "Back pain therapy"},
            {"13", "4", "7", now.minusDays(5), Appointment.Status.COMPLETED, "Eye Exam", "Vision test"},
            {"14", "3", "6", now.plusDays(10), Appointment.Status.UPCOMING, "Cardiology", "ECG follow-up"},
        };
        int seq = 1;
        for (var a : appointments) {
            var appointment = new Appointment(String.valueOf(seq), (String) a[0], (String) a[1], (String) a[2],
                (LocalDateTime) a[3], (Appointment.Status) a[4], (String) a[5], (String) a[6]);
            appointmentRepository.save(appointment);
            seq++;
        }
    }

    private void createClinicQueues() {
        var queues = new Object[][] {
            {"5", "10", ClinicQueue.Priority.HIGH, ClinicQueue.Status.WAITING, 15},
            {"5", "11", ClinicQueue.Priority.LOW, ClinicQueue.Status.WAITING, 30},
            {"6", "12", ClinicQueue.Priority.CRITICAL, ClinicQueue.Status.WAITING, 5},
            {"6", "13", ClinicQueue.Priority.MEDIUM, ClinicQueue.Status.WITH_DOCTOR, 20},
            {"7", "14", ClinicQueue.Priority.LOW, ClinicQueue.Status.WAITING, 45},
        };
        int seq = 1;
        for (var q : queues) {
            var entry = new ClinicQueue(String.valueOf(seq), (String) q[0], (String) q[1],
                (ClinicQueue.Priority) q[2], (ClinicQueue.Status) q[3], (int) q[4]);
            clinicQueueRepository.save(entry);
            seq++;
        }
    }

    private void createClinicStaff() {
        var staff = new Object[][] {
            {"5", "Dr. Alisher Karimov", ClinicStaff.Role.DOCTOR, "998901234100", "alisher@citymed.uz", "Cardiology", "1"},
            {"5", "Nurse Malika", ClinicStaff.Role.NURSE, "998901234101", "malika@citymed.uz", "General", "1"},
            {"5", "Receptionist Jamshid", ClinicStaff.Role.RECEPTIONIST, "998901234102", "jamshid@citymed.uz", "", "1"},
            {"6", "Dr. Nilufar Azizova", ClinicStaff.Role.DOCTOR, "998901234103", "nilufar@shifo.uz", "Neurology", "1"},
            {"6", "Nurse Sabina", ClinicStaff.Role.NURSE, "998901234104", "sabina@shifo.uz", "Pediatrics", "1"},
            {"7", "Dr. Bobur Rahimov", ClinicStaff.Role.DOCTOR, "998901234105", "bobur@davlat.uz", "Orthopedics", "1"},
            {"7", "Admin Farrux", ClinicStaff.Role.ADMIN, "998901234106", "farrux@davlat.uz", "", "1"},
            {"8", "Dr. Kamola", ClinicStaff.Role.DOCTOR, "998901234107", "kamola@nur.uz", "Dermatology", "1"},
        };
        int seq = 1;
        for (var s : staff) {
            var staffMember = new ClinicStaff(String.valueOf(seq), (String) s[0], (String) s[1],
                (ClinicStaff.Role) s[2], (String) s[3], (String) s[4], (String) s[5], "1".equals((String) s[6]));
            clinicStaffRepository.save(staffMember);
            seq++;
        }
    }

    private void createTransactions() {
        var transactions = new Object[][] {
            {"5", "10", 150.0, Transaction.Type.PAYMENT, Transaction.Status.COMPLETED, "Consultation fee"},
            {"5", "11", 200.0, Transaction.Type.PAYMENT, Transaction.Status.COMPLETED, "Lab tests"},
            {"6", "12", 500.0, Transaction.Type.PAYMENT, Transaction.Status.COMPLETED, "Emergency consultation"},
            {"6", "13", 75.0, Transaction.Type.PAYMENT, Transaction.Status.COMPLETED, "Follow-up visit"},
            {"7", "14", 300.0, Transaction.Type.PAYMENT, Transaction.Status.COMPLETED, "X-Ray and consultation"},
            {"5", "10", 50.0, Transaction.Type.REFUND, Transaction.Status.COMPLETED, "Overpayment refund"},
            {"7", "15", 120.0, Transaction.Type.PAYMENT, Transaction.Status.PENDING, "Lab tests pending"},
            {"8", "16", 250.0, Transaction.Type.PAYMENT, Transaction.Status.COMPLETED, "Dermatology consultation"},
            {"8", "17", 180.0, Transaction.Type.PAYMENT, Transaction.Status.COMPLETED, "Skin treatment"},
            {"9", "18", 90.0, Transaction.Type.PAYMENT, Transaction.Status.COMPLETED, "General checkup"},
        };
        int seq = 1;
        for (var t : transactions) {
            var transaction = new Transaction(String.valueOf(seq), (String) t[0], (String) t[1],
                (double) t[2], (Transaction.Type) t[3], (Transaction.Status) t[4], (String) t[5]);
            transactionRepository.save(transaction);
            seq++;
        }
    }

    private void createEmergencyAlerts() {
        var alerts = new Object[][] {
            {"10", "emergency-1", EmergencyAlert.Status.ACTIVE, null, "Car accident - urgent care"},
            {"12", "emergency-2", EmergencyAlert.Status.ACTIVE, null, "Allergic reaction - anaphylaxis"},
            {"14", "emergency-1", EmergencyAlert.Status.RESOLVED, "emergency-admin", "Chest pain - resolved"},
        };
        int seq = 1;
        for (var a : alerts) {
            var alert = new EmergencyAlert(String.valueOf(seq), (String) a[0], (String) a[1],
                (EmergencyAlert.Status) a[2], (String) a[3], (String) a[4]);
            if (alert.getStatus() == EmergencyAlert.Status.RESOLVED) {
                alert.setResolvedAt(LocalDateTime.now().minusHours(2));
            }
            emergencyAlertRepository.save(alert);
            seq++;
        }
    }
}
