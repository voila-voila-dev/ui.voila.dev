import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Table } from "#components/table";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot="${slot}"]`);
}

describe("Table", () => {
  test("renders each part tagged with its data-slot", () => {
    const screen = render(
      <Table.Root>
        <Table.Caption>Caption</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Value</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell>Total</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>,
    );
    expect(queryBySlot(screen, "table-container")?.tagName).toBe("DIV");
    expect(queryBySlot(screen, "table")?.tagName).toBe("TABLE");
    expect(queryBySlot(screen, "table-header")?.tagName).toBe("THEAD");
    expect(queryBySlot(screen, "table-body")?.tagName).toBe("TBODY");
    expect(queryBySlot(screen, "table-footer")?.tagName).toBe("TFOOT");
    expect(queryBySlot(screen, "table-row")).not.toBeNull();
    expect(queryBySlot(screen, "table-head")?.textContent).toBe("Name");
    expect(queryBySlot(screen, "table-cell")?.textContent).toBe("Value");
    expect(queryBySlot(screen, "table-caption")?.textContent).toBe("Caption");
  });

  test("merges user className over the base classes", () => {
    const screen = render(
      <Table.Root className="custom-table">
        <Table.Body>
          <Table.Row className="custom-row">
            <Table.Cell>x</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    const table = queryBySlot(screen, "table");
    expect(table?.classList.contains("custom-table")).toBe(true);
    expect(table?.classList.contains("w-full")).toBe(true);
    const row = queryBySlot(screen, "table-row");
    expect(row?.classList.contains("custom-row")).toBe(true);
    expect(row?.classList.contains("border-b")).toBe(true);
  });
});
