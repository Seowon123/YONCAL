package univ.yonsei.yoncal.auth.controller;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import univ.yonsei.yoncal.auth.dto.UserRequest;
import univ.yonsei.yoncal.auth.service.AuthService;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/join")
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class AuthController {
    private final AuthService authService;
    @PostMapping(path = "/reg")
    public String userRegister(
            @Valid
            @ModelAttribute("userRequest") UserRequest userRequest, BindingResult bindingResult, Model model
    ) {
        if (!userRequest.getPassword1().equals(userRequest.getPassword2())) {
            bindingResult.rejectValue("password2", "PasswordInCorrect", "비밀번호가 서로 다릅니다.");
            return "signup";
        }
        try {
            authService.userRegister(userRequest);
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            bindingResult.reject("signupFailed", "중복사용자가 있습니다.");
            return "page_signup";
        } catch (Exception e) {
            e.printStackTrace();
            bindingResult.reject("signupFailed", e.getMessage());
            return "page_signup";
        }
        return "redirect:/login";
    }

    @GetMapping(path = "/register")
    public String register(
            UserRequest userRequest
    ) {
        return "register";
    }
    @GetMapping(path = "/login")
    public String login() {
        return "login";
    }
}
