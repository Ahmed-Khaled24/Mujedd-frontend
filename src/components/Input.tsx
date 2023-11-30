type InputProps = {
    label: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    type?: string;
};

export default function Input({ label, value, type, onChange }: InputProps) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={label} className="font-bold">
                {label}:
            </label>
            <input
                className="rounded border border-slate-500 p-2"
                type={type ?? 'text'}
                placeholder={label}
                id={label}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}