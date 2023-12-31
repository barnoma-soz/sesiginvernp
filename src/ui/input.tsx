import { ChangeEvent } from "react";
import { css } from "@emotion/css";
import { theme } from "./theme.tsx";
import { TextField } from "../lib/mobx-form/mobx-form.ts";
import { observer } from "mobx-react-lite";

interface Props {
  placeholder?: string;
  type?: "input" | "textarea";
  field: TextField<string>;
  rows?: number;
}

export const Input = observer((props: Props) => {
  const { field, placeholder, type, rows } = props;
  const { onChange, value, isTouched, error, onBlur } = field.props;

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(event.target.value);
  };

  const Tag = type === "textarea" ? "textarea" : "input";

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: 4 })}>
      <Tag
        className={css({
          display: "flex",
          padding: 10,
          fontSize: 16,
          flex: 1,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor:
            isTouched && error ? theme.danger : theme.secondaryBgColor,
          borderRadius: theme.borderRadius,
          backgroundColor: theme.bgColor,
          transition: "border-color 0.3s",
          ":focus": {
            borderColor: theme.buttonColor,
            outline: "none",
          },
        })}
        type="text"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={handleInputChange}
      />
      {isTouched && error ? (
        <div className={css({ fontSize: 14, color: theme.danger })}>
          {error}
        </div>
      ) : null}
    </div>
  );
});
