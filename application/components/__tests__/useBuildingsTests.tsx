/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from "@testing-library/react";
import { useBuildings } from "../../app/utils/useBuildings";
import { supabase } from "../../app/lib/supabase";

process.env.EXPO_PUBLIC_SUPABASE_URL = "https://dummy.supabase.url";
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = "dummy-key";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);  

jest.mock("../../app/lib/supabase", () => ({
    supabase: {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          data: [{ id: 1, name: "Building A" }],
          error: null,
        })),
      })),
    },
  }));

describe("useBuildings Hook", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and returns building data", async () => {
    const mockData = [{ id: 1, name: "Building A" }];
    
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const { result } = renderHook(() => useBuildings());

    await waitFor(() => {
      expect(result.current).toEqual(mockData);
    });
  });

  it("handles errors gracefully", async () => {
    console.error = jest.fn();

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: null, error: { message: "Failed to fetch" } }),
    });

    const { result } = renderHook(() => useBuildings());

    await waitFor(() => {
      expect(result.current).toEqual([]);
      expect(console.error).toHaveBeenCalledWith("Error fetching buildings:", "Failed to fetch");
    });
  });
});
