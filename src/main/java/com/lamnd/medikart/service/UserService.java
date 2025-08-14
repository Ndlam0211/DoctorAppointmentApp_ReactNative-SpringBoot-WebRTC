package com.lamnd.medikart.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.lamnd.medikart.dto.UpdateUserRequest;
import com.lamnd.medikart.dto.CredentialDTO;
import com.lamnd.medikart.entity.User;
import com.lamnd.medikart.exception.BadRequestException;
import com.lamnd.medikart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(GoogleIdToken.Payload payload) {
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String photo = (String) payload.get("picture");

        User user = User.builder()
                .email(email)
                .name(name)
                .image(photo)
                .roles(List.of(User.UserRole.USER))
                .build();

        return userRepository.save(user);
    }

    // Local email/password signup
    public User createLocalUser(CredentialDTO dto) {
        String encoded = passwordEncoder.encode(dto.getPassword());
        User user = User.builder()
                .email(dto.getEmail())
                .name(dto.getName())
                .password(encoded)
                .roles(List.of(User.UserRole.USER))
                .build();
        return userRepository.save(user);
    }

    // Validate credentials for login
    public User validateCredentials(CredentialDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail());
        if (user == null || user.getPassword() == null || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }
        return user;
    }

    // New methods for controller CRUD
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User Not Found!"));
    }

    public User update(String id, UpdateUserRequest req) {
        User user = getById(id);
        if (req.getName() != null) user.setName(req.getName());
        if (req.getImage() != null) user.setImage(req.getImage());
        if (req.getPhoneNumber() != null) user.setPhoneNumber(req.getPhoneNumber());
        if (req.getIsActive() != null) user.setIsActive(req.getIsActive());
        if (req.getRoles() != null && !req.getRoles().isEmpty()) user.setRoles(req.getRoles());
        return userRepository.save(user);
    }

    public void delete(String id) {
        userRepository.deleteById(id);
    }
}
