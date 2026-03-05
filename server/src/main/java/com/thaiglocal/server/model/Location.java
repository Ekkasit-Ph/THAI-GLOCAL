package com.thaiglocal.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "locations")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long locationId;
    private String locationName;
    private String latitude;
    private String longitude;
    private String description;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activityId", referencedColumnName = "activityId", nullable = false)
    private Activity activity;
}
