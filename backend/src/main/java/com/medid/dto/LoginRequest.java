package com.medid.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank String phone,
    @NotBlank String code
) {}
