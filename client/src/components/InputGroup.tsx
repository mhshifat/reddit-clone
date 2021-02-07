import classNames from "classnames";
import React from "react";

interface Props {
	className?: string;
	type: "text" | "email" | "password";
	placeholder: string;
	value: string;
	error: string | undefined;
	setValue: (str: string) => void;
}

const InputGroup: React.FC<Props> = (props) => {
	const { className, type, error, placeholder, value, setValue } = props;

	return (
		<div className={className}>
			<input
				type={type}
				className={classNames(
					"w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white",
					{ "border-red-500": error }
				)}
				placeholder={placeholder}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
			<small className="font-medium text-red-600">{error}</small>
		</div>
	);
};

export default InputGroup;
