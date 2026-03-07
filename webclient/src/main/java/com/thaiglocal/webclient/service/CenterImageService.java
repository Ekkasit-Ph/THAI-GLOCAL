package com.thaiglocal.webclient.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.codec.multipart.FilePart;

import com.thaiglocal.webclient.dto.request.FileRequest;
import com.thaiglocal.webclient.dto.response.FileResponse;

import reactor.core.publisher.Mono;

@Service
public class CenterImageService {

    private final WebClient webClient;

public CenterImageService(WebClient.Builder builder,
            @Value("${server.api.base-url:http://localhost:8081}") String baseUrl) {
        this.webClient = builder
                .baseUrl(baseUrl)
                .build();
    }

    public Mono<FileResponse> uploadCenterImage(Mono<FilePart> fileMono) {
        return fileMono.flatMap(file -> {
            MultipartBodyBuilder builder = new MultipartBodyBuilder();
            builder.part("file", file)
                    .filename(file.filename())
                    .contentType(file.headers().getContentType());

            return webClient
                    .post()
                    .uri("/api/files/upload")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(builder.build()))
                    .retrieve()
                    .bodyToMono(FileResponse.class);
        });
    }

    public Mono<Void> deleteImage(String imageUrl) {
        FileRequest request = new FileRequest(imageUrl);
        return webClient
                .method(HttpMethod.DELETE)
                .uri("/api/files/delete")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Void.class);
    }
}
