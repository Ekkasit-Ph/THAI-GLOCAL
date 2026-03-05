package com.thaiglocal.server.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "activity_statuses")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activityStatusId;
    private LocalDateTime updateTime;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activityId", referencedColumnName = "activityId", nullable = false)
    private Activity activity;
}
