"use client";

import 'react-data-grid/lib/styles.css';
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from 'react-data-grid';
import css from 'styled-jsx/css';
import { IReportColumn, IReportDesigner } from '@/components/interfaces/reportdesigner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const columns = [
    { key: 'id', name: 'ID' },
    { key: 'title', name: 'Title' }
];

const rows = [
    { id: 0, title: 'Example' },
    { id: 1, title: 'Demo' }
];

const session = await getSession() as SessionPayload;

const filterColumnClassName = 'filter-cell';

const filterContainerClassname = css`
  .${filterColumnClassName} {
    line-height: 35px;
    padding: 0;
    > div {
      padding-block: 0;
      padding-inline: 8px;

      &:first-child {
        border-block-end: 1px solid var(--rdg-border-color);
      }
    }
  }
`;

function EmptyRowsRenderer() {
    return (
        <div style={{ textAlign: "center", gridColumn: "1/-1" }} className="my-6">
            No Repoort Submissions
        </div>
    );
}


export const replaceMetas = (forms: any, metaforms: any, clean = false) => {
    return forms.map((node: any) => {
        const meta = metaforms.find((meta: any) => meta.id === node.id);
        const i = {
            id: node.id,
            key: node.id,
            name: meta ? meta.label : "..",
            maxWidth: 300,
            width: 130,
            cellClass(row: any) {
                return `cell-data text-center ${["⏳", "draft"].includes(row.icon?.trim().split(" ")[0] || "")
                    ? "pointer-events-none bg-gray-300 opacity-85"
                    : ""
                    }  ${row?.clickable ? "" : "pointer-events-none"} 
               ${row.color ? `${row.color}` : ""}`;
            },
            renderCell({ row }: any) {
                return <div className="text-center">{row[node.id]}</div>;
            },
            ...meta,
        };
        const obj =
            node.children && node.children.length !== 0
                ? {
                    ...i,
                    children: replaceMetas(node.children, metaforms),
                }
                : { ...i };

        return obj;
    });
}


export default function MonitoringCFW() {

    const [report, setReport] = useState<IReportDesigner>()
    const [, setReportColumn] = useState<IReportColumn[]>()
    const [gHeader, setGHeader] = useState([])




    useEffect(() => {
        (async () => {
            try {
                if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open

                const gr = await dexieDb.report_designer.where("id").equals("48ff68ad-9ff6-42da-8e4e-96291789800b").first()
                const gc = await dexieDb.report_column.where("report_designer_id").equals("48ff68ad-9ff6-42da-8e4e-96291789800b").toArray()
                const colheader = JSON.parse(gr!.columns)

                const gheader = replaceMetas(colheader, gc)
                setGHeader(gheader)
                setReport(gr)
                setReportColumn(gc)
                console.log('load', { gr, gc, colheader, gheader })
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        })();
    }, [])


    const handleCellClick = (props: any) => {
        console.log("handleCellClick", props);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
                    <span className='font-bold'>Report</span>
                </CardTitle>

            </CardHeader>
            <CardContent>
                <h1>This is the MonitoringCFW Page</h1>
                <DataGrid
                    className={`${filterContainerClassname} rdg-light h-full`}
                    columns={gHeader}
                    rows={rows}
                    direction={"ltr"}
                    renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
                    // renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
                    // rowHeight={(props) => getRowHeight(props)}
                    onCellClick={(e) => handleCellClick(e)}
                    // onCellDoubleClick={(props) => {
                    //   if (props.row?.clickable == true) {
                    //     onCellClick(props.row);
                    //   }
                    //   console.log("onCellClick", props);
                    // }}
                    defaultColumnOptions={{
                        resizable: true,
                    }}
                />

            </CardContent>
        </Card>
    );
}

