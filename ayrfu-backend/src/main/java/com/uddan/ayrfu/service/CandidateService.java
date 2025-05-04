package com.uddan.ayrfu.service;

import com.uddan.ayrfu.dto.request.ApplicationRequest;
import com.uddan.ayrfu.dto.request.CandidateRequest;
import com.uddan.ayrfu.dto.response.ApplicationResponse;
import com.uddan.ayrfu.dto.response.CandidateResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CandidateService {

    CandidateResponse createCandidate(CandidateRequest candidateRequest);

    CandidateResponse getCandidateById(Long id);

    CandidateResponse getCandidateByEmail(String email);

    List<CandidateResponse> getAllCandidates();

    CandidateResponse updateCandidate(Long id, CandidateRequest candidateRequest);

    void deleteCandidate(Long id);

    String uploadCandidateCV(Long candidateId, MultipartFile file);

    ApplicationResponse applyForPosition(Long candidateId, ApplicationRequest applicationRequest);

    List<ApplicationResponse> getCandidateApplications(Long candidateId);
}

