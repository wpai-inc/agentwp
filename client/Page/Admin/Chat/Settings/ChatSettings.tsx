import { useEffect, useState } from 'react';
import { Switch } from '@/Components/ui/switch';
import { Label } from '@/Components/ui/label';
import { useClient } from '@/Providers/ClientProvider';

type Setting = {
  name: string;
  label: string;
  value: any;
};

const defaultSettings: Setting[] = [
  {
    name: 'webEnabled',
    label: 'Web Enabled',
    value: false,
  },
];

export default function ChatSettings() {
  const [settings, setSettings] = useState<Setting[]>(defaultSettings);
  const { updateSetting } = useClient();
  const { getSettings } = useClient();

  async function handleChange(name: string, checked: boolean) {
    const updated = await updateSetting(name, checked);
    setSettings(prevSettings =>
      prevSettings.map(setting => {
        if (updated.name === name) {
          return { ...setting, value: updated.value };
        }
        return setting;
      }),
    );
  }

  async function fetchSettings() {
    const settings = await getSettings();
    setSettings(settings);
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {settings.map(setting => (
        <div className="flex items-center space-x-2" key={setting.name}>
          <Switch
            id={setting.name}
            checked={setting.value}
            onCheckedChange={(checked: boolean) => handleChange(setting.name, checked)}
          />
          <Label htmlFor={setting.name}>{setting.label}</Label>
        </div>
      ))}
    </div>
  );
}
