package univ.yonsei.yoncal.auth.service;

import univ.yonsei.yoncal.auth.common.DataNotFoundException;
import univ.yonsei.yoncal.auth.common.UserRole;
import univ.yonsei.yoncal.auth.entity.UserEntity;
import univ.yonsei.yoncal.auth.entity.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserSecurityService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        Optional<UserEntity> _userEntity = userRepository.findByUserName(userName);
        if (_userEntity.isEmpty()) {
            throw new DataNotFoundException("사용자를 찾을수 없습니다.");
        }
        UserEntity userEntity = _userEntity.get();
        List<GrantedAuthority> authorities = new ArrayList<>();
        if ("admin".equals(userName)) {
            authorities.add(new SimpleGrantedAuthority(UserRole.ADMIN.getValue()));
        } else {
            authorities.add(new SimpleGrantedAuthority(UserRole.USER.getValue()));
        }
        return new User(userEntity.getUserName(), userEntity.getPassword(), authorities);
    }
}