package univ.yonsei.yoncal.subject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import univ.yonsei.yoncal.subject.DTO.Subject;
import univ.yonsei.yoncal.subject.DTO.SubjectRepository;

import java.util.List;

@RestController
public class SubjectController {

    @Autowired
    private SubjectRepository subjectRepository;

    @GetMapping("/api/subjects")
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }
}
