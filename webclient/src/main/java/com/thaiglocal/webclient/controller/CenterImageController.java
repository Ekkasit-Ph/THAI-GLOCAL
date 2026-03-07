package com.thaiglocal.webclient.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.codec.multipart.FilePart;

import com.thaiglocal.webclient.dto.request.FileRequest;
import com.thaiglocal.webclient.dto.response.FileResponse;
import com.thaiglocal.webclient.service.CenterImageService;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/client/files")
public class CenterImageController {

    private final CenterImageService centerImageService;

    public CenterImageController(CenterImageService centerImageService) {
        this.centerImageService = centerImageService;
    }

    @PostMapping("/upload")
    public Mono<FileResponse> uploadCenterImage(@RequestPart("file") Mono<FilePart> file) {
        return centerImageService.uploadCenterImage(file);
    }

    @DeleteMapping("/delete")
    public Mono<ResponseEntity<Void>> deleteImage(@RequestBody FileRequest request) {
        return centerImageService.deleteImage(request.imageUrl())
                .thenReturn(ResponseEntity.ok().build());
    }
}
