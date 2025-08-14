package com.lamnd.medikart.controller;

import com.lamnd.medikart.annotation.ApiSuccess;
import com.lamnd.medikart.dto.ApiResponse;
import com.lamnd.medikart.dto.UpdateUserRequest;
import com.lamnd.medikart.entity.User;
import com.lamnd.medikart.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @ApiSuccess(code = "USER_LIST", message = "Users fetched")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @ApiSuccess(code = "USER_DETAIL", message = "User fetched")
    public User getUserById(@PathVariable String id) {
        return userService.getById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable String id, @RequestBody @Valid UpdateUserRequest request) {
        User updated = userService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "USER_UPDATED", "User updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        userService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "USER_DELETED", "User deleted"));
    }
}
