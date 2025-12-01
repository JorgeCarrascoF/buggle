import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { getLogs } from "../queries/getLogs";
import Button from "./Button";
import Icon from "@mdi/react";
import { mdiChevronLeft } from "@mdi/js";
import { mdiChevronRight } from "@mdi/js";
import { useNavigate } from "react-router-dom";
import LogTable from "./LogTable";
import SelectInput from "./SelectInput";
import DateInput from "./DateInput";
import getPageNumbers from "../utils/getPageNumbers";

const LOGS_PER_PAGE = 10;

const PaginatedLogDashboard = ({ search, setSearch }) => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [environmentFilter, setEnvironmentFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const navigate = useNavigate();

  const { data, isLoading, error, isPreviousData } = useQuery({
    queryKey: [
      "logs",
      page,
      search,
      typeFilter,
      dateFilter,
      statusFilter,
      environmentFilter,
      priorityFilter,
    ],
    queryFn: () =>
      getLogs({
        type: typeFilter,
        status: statusFilter,
        environment: environmentFilter,
        priority: priorityFilter,
        date: dateFilter,
        search: search.trim(),
        searchId:
          !isNaN(search) && search.trim() !== "" ? Number(search) : null,
        page,
        limit: LOGS_PER_PAGE,
      }),
    keepPreviousData: true,
  });

  const handleRowClick = (row) => {
    navigate(`/dashboard/log/${row.id}`);
  };

  let totalPages = data ? Math.ceil(data.total / LOGS_PER_PAGE) : 0;

  return (
    <div className="flex flex-col h-full w-full self-start">
      <div className="w-full">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-[8rem]">
            <SelectInput
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              placeholder="Error type"
              options={[
                { value: "error", label: "Error" },
                { value: "warning", label: "Warning" },
                { value: "info", label: "Info" },
              ]}
            />
          </div>

          <div className="w-[7.5rem]">
            <SelectInput
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              placeholder="Priority"
              options={[
                { value: "high", label: "High", color: "#ff5252" },
                { value: "medium", label: "Medium", color: "#fb8c00" },
                { value: "low", label: "Low", color: "#4CAF50" },
              ]}
            />
          </div>

          <div className="w-[10rem]">
            <SelectInput
              value={environmentFilter}
              onChange={(e) => setEnvironmentFilter(e.target.value)}
              placeholder="Environment"
              options={[
                { value: "production", label: "Production" },
                { value: "testing", label: "Testing" },
                { value: "development", label: "Development" },
              ]}
            />
          </div>

          <div className="w-[8rem]">
            <SelectInput
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="Status"
              options={[
                { value: "unresolved", label: "Pending" },
                { value: "in review", label: "In Review" },
                { value: "solved", label: "Resolved" },
              ]}
            />
          </div>

          <DateInput
            value={dateFilter}
            onChange={setDateFilter}
            placeholder="Date"
          />

          {(search ||
            typeFilter ||
            dateFilter ||
            statusFilter ||
            environmentFilter ||
            priorityFilter) && (
            <div>
              <Button
                variant="primary"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("");
                  setDateFilter("");
                  setStatusFilter("");
                  setEnvironmentFilter("");
                  setPriorityFilter("");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center mt-4">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : data.data.length === 0 ? (
        <div className="mt-10">No results found.</div>
      ) : (
        <>
          <div className="mt-4">
            <LogTable data={data?.data ?? []} onRowClick={handleRowClick} />
          </div>
          <div className="flex justify-center text-xs items-center gap-3 mt-auto pt-4">
            <div className="w-[6rem]">
              <Button
                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                disabled={page === 1}
                variant="pagination"
                active={false}
              >
                <Icon path={mdiChevronLeft} size={1} />
                Previous
              </Button>
            </div>
            <div className="flex gap-[6px] h-full items-center">
              {getPageNumbers(page, totalPages).map((p, i) =>
                p === "..." ? (
                  <span key={i} className="px-2">
                    ...
                  </span>
                ) : (
                  <Button
                    variant="pagination"
                    key={i}
                    onClick={() => setPage(p)}
                    active={p === page}
                  >
                    {p}
                  </Button>
                )
              )}
            </div>
            <div className="w-[4.5rem]">
              <Button
                variant="pagination"
                onClick={() => setPage((old) => old + 1)}
                active={false}
                disabled={
                  isPreviousData || (data?.data?.length ?? 0) < LOGS_PER_PAGE
                }
              >
                Next
                <Icon path={mdiChevronRight} size={1} />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaginatedLogDashboard;
