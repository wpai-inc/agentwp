<?php

namespace WpAi\AgentWp\Traits;

use Exception;
use WpAi\AgentWp\Main;

trait HasScheduler
{
    protected static $nowSuffix = '_now';

    public function registerActionSchedules(array $actions): void
    {
        foreach ($actions as $action) {
            $this->validateActionHook($action);
            $hook = self::jobId($action);
            add_action($hook, [$this, $action]);
            add_action($hook.self::$nowSuffix, [$this, $action]);
        }
    }

    public function scheduleNow(string $action, int $throttleDuration = 30): void
    {
        $this->validateActionHook($action);
        $hook = self::jobId($action).self::$nowSuffix;
        $throttle = get_transient($hook.'_throttle');

        if (! $throttle) {
            if (! wp_next_scheduled($hook)) {
                wp_schedule_single_event(time(), $hook);
            }

            set_transient($hook.'_throttle', true, $throttleDuration);
        }

        $this->actions[$hook] = $action;
    }

    /**
     * Schedules the cron job for the given action on the class.
     *
     * @param  string  $action  The method name (public method of the class) to be scheduled.
     * @param  string  $interval  The schedule interval (e.g., 'hourly', 'daily', etc.). Default is 'hourly'.
     */
    public function schedule($action, $interval = 'every_minute')
    {
        $this->validateActionHook($action);
        $hook = self::jobId($action);

        if (! wp_next_scheduled($hook)) {
            wp_schedule_event(time(), $interval, $hook);
        }

        add_action($hook, [$this, $action]);
    }

    /**
     * Unschedules the cron job for the given action on the class.
     *
     * @param  string  $action  The method name to unschedule.
     */
    public static function unschedule($action)
    {
        $hook = self::jobId($action);
        $timestamp = wp_next_scheduled($hook);

        if ($timestamp) {
            wp_unschedule_event($timestamp, $hook);
        }
    }

    /**
     * Clear all scheduled cron jobs for this class.
     */
    public static function clearSchedules(array $events = [])
    {
        foreach ($events as $action) {
            self::unschedule($action);
        }
    }

    /**
     * Validates the action hook.
     *
     * @param  string  $action  The action to validate.
     *
     * @throws Exception
     */
    protected function validateActionHook(string $action): void
    {
        if (! method_exists($this, $action)) {
            // Translators: %1$s is the method name, %2$s is the class name.
            throw new Exception(esc_html(sprintf(__('Method %1$s does not exist in class %2$s', 'agentwp'), $action, get_class($this))));
        }

        if ((new \ReflectionMethod($this, $action))->isPublic() === false) {
            // Translators: %1$s is the method name, %2$s is the class name.
            throw new Exception(esc_html(sprintf(__('Method %1$s must be public in class %2$s', 'agentwp'), $action, get_class($this))));
        }
    }

    protected static function jobId(string $action): string
    {
        $className = (new \ReflectionClass(static::class))->getShortName();

        return strtolower(implode('_', [Main::SLUG, $className, $action]));
    }
}
