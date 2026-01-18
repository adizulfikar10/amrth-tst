import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WizardView } from "./WizardView";
import * as api from "~/services/api";
import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useSearchParams: () => [new URLSearchParams({ role: "admin" }), vi.fn()],
    Link: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

vi.mock("~/services/api", () => ({
  getDepartments: vi.fn(),
  getLocations: vi.fn(),
  getBasicInfoByDepartment: vi.fn(),
  createBasicInfo: vi.fn(),
  createDetailInfo: vi.fn(),
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("WizardView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("Autocomplete renders and fetches suggestions correctly", async () => {
    const user = userEvent.setup();
    const mockDepts = [
      { id: 1, name: "Engineering" },
      { id: 2, name: "HR" },
    ];
    vi.mocked(api.getDepartments).mockResolvedValue(mockDepts);

    render(<WizardView />);

    const deptInput = screen.getByLabelText(/Department/i);

    await user.type(deptInput, "Eng");

    await waitFor(() => {
      expect(api.getDepartments).toHaveBeenCalledWith("Eng");
    });

    await waitFor(() => {
      const option = document.querySelector(
        'datalist#dept-list option[value="Engineering"]'
      );
      expect(option).toBeInTheDocument();
    });
  });

  it("Submit flow handles sequential POST + progress states", async () => {
    vi.mocked(api.getBasicInfoByDepartment).mockResolvedValue([]);
    vi.mocked(api.createBasicInfo).mockResolvedValue({});
    vi.mocked(api.createDetailInfo).mockResolvedValue({});

    render(<WizardView />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });

    const deptInput = screen.getByLabelText(/Department/i);
    fireEvent.change(deptInput, { target: { value: "Engineering" } });
    fireEvent.blur(deptInput);

    await waitFor(() => {
      expect(api.getBasicInfoByDepartment).toHaveBeenCalledWith("Engineering");
    });

    fireEvent.change(screen.getByLabelText(/Role/i), {
      target: { value: "Engineer" },
    });

    const nextButton = screen.getByRole("button", { name: /Next/i });
    await waitFor(() => expect(nextButton).toBeEnabled());
    fireEvent.click(nextButton);

    expect(screen.getByText(/Step 2: Details/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Office Location/i), {
      target: { value: "New York" },
    });

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Submitting basicInfo/i)).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(api.createBasicInfo).toHaveBeenCalled();
      },
      { timeout: 4000 }
    );

    await waitFor(() => {
      expect(screen.getByText(/Submitting details/i)).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(api.createDetailInfo).toHaveBeenCalled();
      },
      { timeout: 4000 }
    );

    await waitFor(() => {
      expect(
        screen.getByText(/All data processed successfully/i)
      ).toBeInTheDocument();
    });
  }, 15000);
});
