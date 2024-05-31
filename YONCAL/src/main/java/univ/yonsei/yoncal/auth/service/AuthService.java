package univ.yonsei.yoncal.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import univ.yonsei.yoncal.auth.dto.UserRequest;
import univ.yonsei.yoncal.auth.entity.UserEntity;
import univ.yonsei.yoncal.auth.entity.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
        public UserEntity userRegister(
                UserRequest userRequest
    ) {
        var entity = UserEntity.builder()
                .userName(userRequest.getUserName())
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword1()))
                .build()
                ;
        return userRepository.save(entity);
    }
}
