package org.example.caregiver.controller;

import jakarta.servlet.http.HttpSession;
import org.example.caregiver.model.Member;
import org.example.caregiver.repository.MemberRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final MemberRepository memberRepository;

    public AuthController(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request, HttpSession session) {
        String email = request.get("email");
        String password = request.get("password");
        String name = request.get("name");
        
        // 간단한 회원가입 로직
        Member member = new Member(email, password, name, null);
        memberRepository.save(member);
        
        // 가입 후 바로 로그인 처리
        session.setAttribute("memberId", member.getId());
        
        return ResponseEntity.ok(Map.of("message", "회원가입 성공", "memberId", member.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request, HttpSession session) {
        String email = request.get("email");
        String password = request.get("password");

        // 이메일로 회원을 찾는 간단한 로직 (MemberRepository에 메서드 추가 필요하지만 모든 회원을 뒤져서 찾음 - 단순화)
        Optional<Member> memberOpt = memberRepository.findAll().stream()
                .filter(m -> m.getUsername().equals(email) && m.getPassword().equals(password))
                .findFirst();

        if (memberOpt.isPresent()) {
            session.setAttribute("memberId", memberOpt.get().getId());
            return ResponseEntity.ok(Map.of("message", "로그인 성공", "name", memberOpt.get().getName()));
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "아이디 또는 비밀번호가 틀렸습니다."));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "로그아웃 성공"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        Long memberId = (Long) session.getAttribute("memberId");
        System.out.println("Session ID: " + session.getId() + ", MemberId in session: " + memberId);
        
        if (memberId != null) {
            Optional<Member> memberOpt = memberRepository.findById(memberId);
            if (memberOpt.isPresent()) {
                Member member = memberOpt.get();
                return ResponseEntity.ok(Map.of("email", member.getUsername(), "name", member.getName()));
            }
        }
        return ResponseEntity.ok(null);
    }
}
