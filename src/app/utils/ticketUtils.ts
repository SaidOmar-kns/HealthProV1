// Types for different ticket data formats
interface PriorityTicket {
    name: string;
    tickets: number;
    color: string;
}

interface StatusTicket {
    status: string;
    tickets: number;
}

// Color mappings for priorities
const PRIORITY_COLORS = {
    High: '#ef4444',
    Medium: '#f59e0b',
    Low: '#22c55e',
    Uncategorized: '#800080'
} as const;

export const ticketUtils = {
    /**
     * Transforms priority-based ticket data
     * @param data Record<string, number> - Raw API response
     * @param includeZeros boolean - Whether to include priorities with 0 tickets
     */
    transformPriorityData: (
        data: Record<string, number>,
        includeZeros: boolean = true
    ): PriorityTicket[] => {
        return Object.entries(data)
            .filter((entry) => includeZeros || entry[1] > 0)
            .map(([key, value]) => ({
                name: key,
                tickets: value,
                color: PRIORITY_COLORS[key as keyof typeof PRIORITY_COLORS] || '#gray'
            }));
    },


    /**
     * Transforms status-based ticket data
     * @param data Record<string, number> - Raw API response
     * @param includeZeros boolean - Whether to include statuses with 0 tickets
     */
    transformStatusData: (
        data: Record<string, number>,
        includeZeros: boolean = true
    ): StatusTicket[] => {
        return Object.entries(data)
            .filter((entry) => includeZeros || entry[1] > 0)
            .map(([key, value]) => ({
                status: key,
                tickets: value
            }));
    },

    /**
     * Custom transformer for any ticket data format
     * @param data Record<string, number> - Raw API response
     * @param transformer Function to transform each entry
     * @param includeZeros boolean - Whether to include entries with 0 tickets
     */
    transformCustomData: <T>(
        data: Record<string, number>,
        transformer: (key: string, value: number) => T,
        includeZeros: boolean = true
    ): T[] => {
        return Object.entries(data)
            .filter((entry) => includeZeros || entry[1] > 0)
            .map(([key, value]) => transformer(key, value));
    },

    /**
     * Get color for a priority level
     * @param priority Priority level
     */
    getPriorityColor: (priority: keyof typeof PRIORITY_COLORS) => {
        return PRIORITY_COLORS[priority] || '#gray';
    },

    /**
     * Formats a ticket number by padding it with leading zeros
     * @param ticketNumber - The ticket number to format
     * @returns Formatted ticket string (e.g., "Ticket # 000123")
     */
    formatTicketNumber: (ticketNumber: number): string => {
        return `Ticket # ${String(ticketNumber).padStart(6, '0')}`;
    },


    formatDate: (dateString?: string): string => {
        if (!dateString) return ''; // Return empty string if no date is provided

        const date = new Date(dateString);

        // Check if time is included in the original string
        const hasTime = dateString.includes(':') || dateString.includes('T');

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            ...(hasTime && {
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        return date.toLocaleDateString('en-US', options);
    }
};

