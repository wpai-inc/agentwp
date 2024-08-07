<?php

namespace WpAi\AgentWp\Jobs;

abstract class Job
{

    const AGENTWP_CRON_THROTTLE = 60;

    public function register()
    {
        add_action('admin_init', [$this, 'sendByCron']);
        add_action($this->eventName(), [$this, 'send']);
        add_action('update_option', [$this, 'sendImmediately'], 10, 3);
    }

    private function scheduleSingleCronEvent(string $eventName, bool $ignoreThrottle = false): void
    {
        $throttle = $ignoreThrottle ? 0 : get_transient($eventName.'_throttle');
        if ( ! wp_next_scheduled($eventName) && ! $throttle) {
            wp_schedule_single_event(time(), $eventName);
            set_transient($eventName.'_throttle', true, self::AGENTWP_CRON_THROTTLE);
        }
    }

    public function sendByCron(): void
    {
        $this->scheduleSingleCronEvent(
            $this->eventName(),
        );
    }

    public function sendImmediately($option, $old_value, $value): void
    {
        if (str_contains($option, 'agentwp')) {
            $this->scheduleSingleCronEvent(
                $this->eventName(),
                true
            );
        }
    }

    abstract public function send();

    abstract public function eventName(): string;
}
