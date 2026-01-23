import {
    TableCell,
    TableHead as MuiTableHead,
    TableRow,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

interface TableHeadProps {
    tableName: string;
    headings: string[];
}

export default function TableHead({tableName, headings}: TableHeadProps): JSX.Element {
    const theme = useTheme();
    return (
        <MuiTableHead sx={{backgroundColor: theme.palette.primary.main}}>
            <TableRow key={tableName+'header'}>
                {headings.map((heading) => {
                    return (
                        <TableCell key={tableName+heading} sx={{color: theme.palette.primary.contrastText}}>
                            {heading}
                        </TableCell>
                    )
                })}
            </TableRow>
        </MuiTableHead>
    )
}