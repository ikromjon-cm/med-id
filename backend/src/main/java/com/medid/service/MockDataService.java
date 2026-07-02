package com.medid.service;

import com.medid.model.*;
import com.medid.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MockDataService {

    private final UserRepository userRepository;
    private final MedicalProfileRepository medicalProfileRepository;
    private final DocumentRepository documentRepository;
    private final EmergencyContactRepository emergencyContactRepository;
    private final NotificationRepository notificationRepository;
    private final AccessLogRepository accessLogRepository;

    public MockDataService(UserRepository userRepository,
                           MedicalProfileRepository medicalProfileRepository,
                           DocumentRepository documentRepository,
                           EmergencyContactRepository emergencyContactRepository,
                           NotificationRepository notificationRepository,
                           AccessLogRepository accessLogRepository) {
        this.userRepository = userRepository;
        this.medicalProfileRepository = medicalProfileRepository;
        this.documentRepository = documentRepository;
        this.emergencyContactRepository = emergencyContactRepository;
        this.notificationRepository = notificationRepository;
        this.accessLogRepository = accessLogRepository;
    }

    @PostConstruct
    public void init() {
        createUsers();
        createProfiles();
        createDocuments();
        createEmergencyContacts();
        createNotifications();
        createAccessLogs();
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
}
