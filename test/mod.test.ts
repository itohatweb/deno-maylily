import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std@0.81.0/testing/asserts.ts";
import maylily from "../mod.ts";

/**
 * mock Date.now()
 */
function mockNow(value: number) {
  Date.now = () => {
    return value;
  };
}

Deno.test({
  name: "sequence",
  async fn(): Promise<void> {
    const options = {
      generatorId: 0,
    };
    mockNow(Date.parse("2019-01-01T00:00:00Z"));
    assertEquals(await maylily(options), "1257485893632000000");
    assertEquals(await maylily(), "1257485893632000001");
    assertEquals(await maylily(), "1257485893632000002");
    assertEquals(await maylily(), "1257485893632000003");
  },
});

Deno.test({
  name: "update time",
  async fn(): Promise<void> {
    const options = {
      generatorId: 0,
    };
    mockNow(Date.parse("2019-01-01T00:00:00Z") + 1);
    assertEquals(await maylily(options), "1257485893634097152");
    assertEquals(await maylily(), "1257485893634097153");
    assertEquals(await maylily(), "1257485893634097154");
    assertEquals(await maylily(), "1257485893634097155");
  },
});

Deno.test({
  name: "next tick",
  async fn(): Promise<void> {
    const options = {
      generatorId: 0,
      sequenceBits: 2,
    };

    mockNow(Date.parse("2019-02-01T00:00:00Z"));
    assertEquals(await maylily(options), "19735982899200000");
    assertEquals(await maylily(), "19735982899200001");
    assertEquals(await maylily(), "19735982899200002");
    assertEquals(await maylily(), "19735982899200003");

    // update now on at the end of the event loop
    window.queueMicrotask(() => {
      const now = Date.now();
      mockNow(now + 1);
    });
    assertEquals(await maylily(), "19735982899232768");
  },
});

Deno.test("doesThrow", async function (): Promise<void> {
  await assertThrowsAsync(
    async (): Promise<void> => {
      mockNow(Date.parse("2000-01-01T00:00:00Z"));
      await maylily();
    },
    Error,
    `Clock moved backwards. Refusing to generate id for 946684800000 milliseconds`,
  );
});

Deno.test({
  name: "change radix",
  async fn(): Promise<void> {
    const options = {
      generatorId: 0,
      sequenceBits: 8,
    };

    mockNow(Date.parse("2019-04-01T00:00:00Z"));
    assertEquals(await maylily(options), "1273793347584000000");
    assertEquals(
      await maylily({ radix: 2 }),
      "1000110101101011011000100110100000000000000000000000000000001",
    );
    assertEquals(
      await maylily({ radix: 4 }),
      "1012231123010310000000000000002",
    );
    assertEquals(await maylily({ radix: 8 }), "106553304640000000003");
    assertEquals(await maylily({ radix: 16 }), "11ad6c4d00000004");
    assertEquals(await maylily({ radix: 32 }), "13bbc9k000005");
    assertEquals(await maylily({ radix: 36 }), "9oea21h9w5c6");
  },
});
