import Check from "@/Icon/Check";
import { cn } from "@/lib/utils";

export default function CheckedText({ checked, text, active }: { checked: boolean, text: string, active?: boolean}) {
    return (
        <div className={cn(
            'flex gap-1 items-center',
            !active && 'opacity-50'
        )}>
            <Check checked={checked} />
            {text}
        </div>
    );
}
