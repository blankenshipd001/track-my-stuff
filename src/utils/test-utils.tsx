import '@testing-library/jest-dom';
import { render } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { Providers as ReelTimeProviders } from "./providers/providers";

type WrapperOptions = {
  children: ReactNode;
};

const Providers = ({ children }: WrapperOptions) => {
  return (
      <ReelTimeProviders>{children}</ReelTimeProviders>
  );
};

type Options = {
  renderOptions?: Omit<WrapperOptions, "wrapper">;
};

export const renderWithProviders = (ui: ReactElement, options?: Options) => {
  const { renderOptions, ...wrapperOptions } = options ?? {};
  
  return render(ui, {
    wrapper: ({ children }) => <Providers {...wrapperOptions}>{children}</Providers>,
    ...renderOptions,
  });
};

export * from "@testing-library/react";
export * from "@testing-library/jest-dom";
// export * from "jest-axe";
