'use client';

import React, { useEffect, useRef } from 'react';

interface BootstrapTableProps {
  data: any[];
  columns: Array<{
    field: string;
    title: string;
    sortable?: boolean;
    searchable?: boolean;
    formatter?: (value: any, row: any) => string;
  }>;
  options?: {
    pagination?: boolean;
    search?: boolean;
    sortable?: boolean;
    pageSize?: number;
    pageList?: number[];
    classes?: string;
    theadClasses?: string;
    tbodyClasses?: string;
  };
  className?: string;
}

export const BootstrapTable: React.FC<BootstrapTableProps> = ({
  data,
  columns,
  options = {},
  className = ''
}) => {
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (!tableRef.current) return;

    // Initialize Bootstrap Table if available
    const $table = (window as any).$?.(tableRef.current);
    if ($table && $table.bootstrapTable) {
      $table.bootstrapTable({
        data,
        columns,
        ...options
      });
    }
  }, [data, columns, options]);

  return (
    <div className={`bootstrap-table-wrapper ${className}`}>
      <table
        ref={tableRef}
        className="table table-striped table-hover"
        data-toggle="table"
        data-search="true"
        data-show-columns="true"
        data-pagination="true"
      >
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                data-field={column.field}
                data-sortable={column.sortable}
                data-searchable={column.searchable}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.formatter
                    ? column.formatter(row[column.field], row)
                    : row[column.field]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BootstrapTable;