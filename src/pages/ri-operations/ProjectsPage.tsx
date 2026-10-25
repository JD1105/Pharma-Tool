import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Add } from '@mui/icons-material'
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, MenuItem, Paper, Stack, Tab, Tabs, TextField, Typography } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { createProject, createTask, listProjects, listTasks } from '../../api/projectApi'
import { countries } from '../../mocks/db'
import type { Project, Task } from '../../types'
import { PageHeader } from '../../components/layout/PageHeader'
import { StatusChip } from '../../components/common/StatusChip'
import { DataTable } from '../../components/common/DataTable'

const blankProject = { name: '', owner: '', country: '', status: 'Planned' as Project['status'], progress: 0, dueDate: '' }
const blankTask = { projectId: '', title: '', assignee: '', status: 'TODO' as Task['status'], dueDate: '' }
const chartColors = ['#1F3A5F', '#0E9AA7', '#ED6C02', '#2E7D32']

export function ProjectsPage() {
  const [tab, setTab] = useState(0)
  const [projectOpen, setProjectOpen] = useState(false)
  const [taskOpen, setTaskOpen] = useState(false)
  const [projectForm, setProjectForm] = useState(blankProject)
  const [taskForm, setTaskForm] = useState(blankTask)
  const queryClient = useQueryClient()
  const projectQuery = useQuery({ queryKey: ['projects'], queryFn: listProjects })
  const taskQuery = useQuery({ queryKey: ['tasks'], queryFn: () => listTasks() })
  const projects = projectQuery.data ?? []
  const tasks = taskQuery.data ?? []
  const projectMutation = useMutation({ mutationFn: createProject, onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['projects'] }); setProjectForm(blankProject); setProjectOpen(false) } })
  const taskMutation = useMutation({ mutationFn: createTask, onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['tasks'] }); setTaskForm(blankTask); setTaskOpen(false) } })
  const projectColumns: GridColDef<Project>[] = [
    { field: 'name', headerName: 'Name', minWidth: 220, flex: 1 }, { field: 'owner', headerName: 'Owner', width: 140 }, { field: 'country', headerName: 'Country', width: 150 },
    { field: 'status', headerName: 'Status', width: 130, renderCell: ({ value }) => <StatusChip status={String(value)} /> },
    { field: 'progress', headerName: 'Progress', width: 180, renderCell: ({ value }) => <Box sx={{ width: '100%' }}><LinearProgress variant="determinate" value={Number(value)} /><Typography variant="caption">{value}%</Typography></Box> },
    { field: 'dueDate', headerName: 'Due Date', width: 130 },
  ]
  const taskColumns: GridColDef<Task>[] = [
    { field: 'title', headerName: 'Task', minWidth: 220, flex: 1 }, { field: 'projectId', headerName: 'Project', width: 120 }, { field: 'assignee', headerName: 'Assignee', width: 150 },
    { field: 'status', headerName: 'Status', width: 140, renderCell: ({ value }) => <StatusChip status={String(value)} /> }, { field: 'dueDate', headerName: 'Due Date', width: 130 },
  ]
  const byTaskStatus = ['TODO', 'IN_PROGRESS', 'DONE'].map((status) => ({ status: status.replace('_', ' '), count: tasks.filter((task) => task.status === status).length }))
  const byCountry = countries.map((country) => ({ country, count: projects.filter((project) => project.country === country).length })).filter((row) => row.count)
  return <Box>
    <PageHeader title="Projects" subtitle="Coordinate regulatory projects and tasks." />
    <Paper sx={{ p: 1, mb: 2 }}><Tabs value={tab} onChange={(_, value: number) => setTab(value)}><Tab label="Dashboard" /><Tab label="Projects" /><Tab label="Tasks" /></Tabs></Paper>
    {tab === 0 && <>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: 2, mb: 2 }}>
        {[['Active Projects', projects.filter((item) => item.status === 'Active').length], ['Open Tasks', tasks.filter((item) => item.status !== 'DONE').length], ['Overdue Tasks', tasks.filter((item) => item.status !== 'DONE' && item.dueDate < new Date().toISOString().slice(0,10)).length], ['Completed', projects.filter((item) => item.status === 'Completed').length]].map(([label, value]) => <Card key={label}><CardContent><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h4" fontWeight={700}>{value}</Typography></CardContent></Card>)}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <Paper sx={{ p: 2, height: 330 }}><Typography fontWeight={700}>Tasks by status</Typography><ResponsiveContainer width="100%" height="90%"><BarChart data={byTaskStatus}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="status" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#0E9AA7" /></BarChart></ResponsiveContainer></Paper>
        <Paper sx={{ p: 2, height: 330 }}><Typography fontWeight={700}>Projects by country</Typography><ResponsiveContainer width="100%" height="90%"><PieChart><Pie data={byCountry} dataKey="count" nameKey="country" outerRadius={95} label>{byCountry.map((entry, index) => <Cell key={entry.country} fill={chartColors[index % chartColors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></Paper>
      </Box>
    </>}
    {tab === 1 && <><Box sx={{ mb: 2 }}><Button startIcon={<Add />} variant="contained" onClick={() => setProjectOpen(true)}>New Project</Button></Box><DataTable rows={projects} columns={projectColumns} loading={projectQuery.isLoading} error={projectQuery.isError ? 'Unable to load projects.' : undefined} onRetry={() => void projectQuery.refetch()} getRowId={(row) => row.id} pageSizeOptions={[10,25]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} /></>}
    {tab === 2 && <><Box sx={{ mb: 2 }}><Button startIcon={<Add />} variant="contained" onClick={() => setTaskOpen(true)}>New Task</Button></Box><DataTable rows={tasks} columns={taskColumns} loading={taskQuery.isLoading} error={taskQuery.isError ? 'Unable to load tasks.' : undefined} onRetry={() => void taskQuery.refetch()} getRowId={(row) => row.id} pageSizeOptions={[10,25]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} /></>}
    <Dialog open={projectOpen} onClose={() => setProjectOpen(false)} fullWidth maxWidth="sm"><DialogTitle>New Project</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><TextField label="Name" value={projectForm.name} onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })} /><TextField label="Owner" value={projectForm.owner} onChange={(event) => setProjectForm({ ...projectForm, owner: event.target.value })} /><TextField select label="Country" value={projectForm.country} onChange={(event) => setProjectForm({ ...projectForm, country: event.target.value })}>{countries.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField><TextField select label="Status" value={projectForm.status} onChange={(event) => setProjectForm({ ...projectForm, status: event.target.value as Project['status'] })}>{['Planned','Active','On Hold','Completed'].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField><TextField type="date" label="Due Date" InputLabelProps={{ shrink: true }} value={projectForm.dueDate} onChange={(event) => setProjectForm({ ...projectForm, dueDate: event.target.value })} /></Stack></DialogContent><DialogActions><Button onClick={() => setProjectOpen(false)}>Cancel</Button><Button variant="contained" onClick={() => projectMutation.mutate(projectForm)}>Save</Button></DialogActions></Dialog>
    <Dialog open={taskOpen} onClose={() => setTaskOpen(false)} fullWidth maxWidth="sm"><DialogTitle>New Task</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><TextField label="Title" value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} /><TextField select label="Project" value={taskForm.projectId} onChange={(event) => setTaskForm({ ...taskForm, projectId: event.target.value })}>{projects.map((project) => <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>)}</TextField><TextField label="Assignee" value={taskForm.assignee} onChange={(event) => setTaskForm({ ...taskForm, assignee: event.target.value })} /><TextField select label="Status" value={taskForm.status} onChange={(event) => setTaskForm({ ...taskForm, status: event.target.value as Task['status'] })}>{['TODO','IN_PROGRESS','DONE'].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField><TextField type="date" label="Due Date" InputLabelProps={{ shrink: true }} value={taskForm.dueDate} onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })} /></Stack></DialogContent><DialogActions><Button onClick={() => setTaskOpen(false)}>Cancel</Button><Button variant="contained" onClick={() => taskMutation.mutate(taskForm)}>Save</Button></DialogActions></Dialog>
  </Box>
}