package com.medid.controller;

import com.medid.dto.ApiResponse;
import com.medid.dto.UserDto;
import com.medid.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(userService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserDto>> create(@RequestBody UserDto dto) {
        var user = userService.create(dto);
        return ResponseEntity.ok(ApiResponse.ok(user, "User created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> update(@PathVariable String id, @RequestBody UserDto dto) {
        var user = userService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.ok(user, "User updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        userService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "User deleted successfully"));
    }
}
