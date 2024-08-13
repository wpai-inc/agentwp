<?php

namespace WpAi\AgentWp\Traits;

trait ScheduleEvent
{
    private function scheduleSingleCronEvent(string $eventName, int $throttleDuration): void
    {
        $throttle = get_transient($eventName.'_throttle');
        if (! wp_next_scheduled($eventName) && ! $throttle) {
            wp_schedule_single_event(time(), $eventName);
            set_transient($eventName.'_throttle', true, $throttleDuration);
        }
    }
}
