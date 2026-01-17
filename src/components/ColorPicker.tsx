// Components/ColorPickerItem.tsx
import { ColorInput } from '@mantine/core';

interface ColorPickerProps {
    color: string;
    onChange: (value: string) => void;
}

export default function ColorPickerItem({color, onChange }: ColorPickerProps) {
    return (
        <ColorInput
            format="hex"
            value={color}
            onChange={onChange}
            size="xs"
        />
    );
}