package com.lamnd.medikart.entity;

import lombok.Data;

import java.time.DayOfWeek;

@Data
public class TimeSlot {
    private String id;
    private DayOfWeek dayOfWeek;
    private String startTime;
    private String endTime;
    private Boolean available;
}
