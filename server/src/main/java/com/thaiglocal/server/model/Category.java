package com.thaiglocal.server.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "categories")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;
    private String CategoryName;

    @Builder.Default
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Activity> activities = new ArrayList<>();

    // Helper method
    // add activity to category and set the category reference in activity
    public void addActivity(Activity activity) {
        activities.add(activity);
        activity.setCategory(this);
    }

    // remove activity from category and set the category reference in activity to null
    public void removeActivity(Activity activity) {
        activities.remove(activity);
        activity.setCategory(null);
    }
}
