package com.thaiglocal.server.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "activities")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activityId;
    private String title;
    private String description;
    private LocalDateTime StartDate;
    private LocalDateTime EndDate;
    private Integer maxPeople;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "communityId", referencedColumnName = "communityId", nullable = false)
    private Community community;

    @Builder.Default
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();

    @OneToOne(mappedBy = "activity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ActivityStatus activityStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoryId", referencedColumnName = "categoryId", nullable = false)
    private Category category;

    @OneToOne(mappedBy = "activity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Location location;

    // Helper method
    // add booking to activity and set the activity reference in booking
    public void addBooking(Booking booking) {
        bookings.add(booking);
        booking.setActivity(this);
    }

    // remove booking from activity and set the activity reference in booking to null
    public void removeBooking(Booking booking) {
        bookings.remove(booking);
        booking.setActivity(null);
    }

    // set activity status and set the activity reference in activity status
    public void setActivityStatus(ActivityStatus activityStatus) {
        this.activityStatus = activityStatus;
        activityStatus.setActivity(this);
    }

    // set location and set the activity reference in location
    public void setLocation(Location location) {
        this.location = location;
        location.setActivity(this);
    }
}
