package com.medid.dto;

import com.medid.model.EmergencyContact;

public record EmergencyContactDto(
    String id,
    String userId,
    String name,
    String phone,
    String relationship,
    Boolean isPrimary
) {
    public static EmergencyContactDto from(EmergencyContact contact) {
        return new EmergencyContactDto(
            contact.getId(), contact.getUserId(), contact.getName(),
            contact.getPhone(), contact.getRelationship(), contact.getIsPrimary()
        );
    }
}
