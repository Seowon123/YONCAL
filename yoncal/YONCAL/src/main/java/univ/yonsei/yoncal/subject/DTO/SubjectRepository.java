package univ.yonsei.yoncal.subject.DTO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import univ.yonsei.yoncal.subject.DTO.Subject;

// SubjectRepository 인터페이스
@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    // 추가적인 쿼리 메서드들
}

