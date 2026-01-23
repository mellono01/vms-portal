import NextLink from 'next/link';

import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper
} from '@mui/material';

import {
  Edit,
  Upload as Upgrade,
  Delete,
} from '@mui/icons-material';

export default function ClearanceMenu({
  anchor,
  isOpen,
  setOpen,
  showUpgrade
}: {
  anchor: null | HTMLElement;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  showUpgrade: boolean;
}) {
  return (
    <Paper sx={{ width: 320, maxWidth: '100%' }}>
      <Menu
        id="clearance-action-menu"
        anchorEl={anchor}
        slotProps={{
          list: {
            'aria-labelledby': 'clearance-action-button',
          },
        }}
        open={isOpen}
        onClose={() => setOpen(false)}
      >
        <MenuList>
          {
            showUpgrade && (
              <NextLink 
                href="/induction/new"
                // to="/induction/new"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <MenuItem>
                    <ListItemIcon>
                      <Upgrade fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Upgrade</ListItemText>
                </MenuItem>
              </NextLink>
            )
          }
          <MenuItem>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </Paper>
  );
}