package com.uddan.ayrfu.service;

import com.uddan.ayrfu.dto.request.ApplicationMessageRequest;
import com.uddan.ayrfu.dto.response.ApplicationMessageResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ApplicationMessageService {

    ApplicationMessageResponse addApplicationMessage(ApplicationMessageRequest messageRequest);

    ApplicationMessageResponse addApplicationMessageWithAttachment(ApplicationMessageRequest messageRequest, MultipartFile file);
}