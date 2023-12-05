<div
                style={{
                    height: '600px',
                    width: '960px',
                    margin: '0'
                }}
                className="ag-theme-alpine"
            >
                <AgGridReact
                    defaultColDef={{
                        flex: 1,
                        minWidth: 100,
                        resizable: true,
                        menuTabs: ['filterMenuTab'],
                    }}
                    frameworkComponents={{ view_note: viewNote }}
                    sideBar={{ toolPanels: ['filters'] }}
                    onGridReady={onGridReady}
                    rowData={notes}
                    getRowNodeId={data => data.row}
                    rowSelection="Single"
                >
                    <AgGridColumn field="ID" filter="agMultiColumnFilter" />
                    <AgGridColumn field="Note" filter="agMultiColumnFilter" />
                    <AgGridColumn field="CreatedAt" filter="agMultiColumnFilter" />
                    <AgGridColumn field="CreatedBy" filter="agMultiColumnFilter" />
                    <AgGridColumn field="Action" cellRenderer="view_note" />
                </AgGridReact>
            </div>