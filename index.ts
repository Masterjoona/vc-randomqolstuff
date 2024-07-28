/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    autoOpenUserDmMutuals: {
        description: "Auto open mutual friends and guilds in dms",
        type: OptionType.BOOLEAN,
        default: true
    },
    showAllFriendsAndGuilds: {
        description: "Show all friends and guilds in user popout",
        type: OptionType.BOOLEAN,
        default: true
    },
    ClickUsersOnPopout: {
        description: "Clicking on a user in the user popout opens their profile",
        type: OptionType.BOOLEAN,
        default: true
    },
    ClickServersOnPopout: {
        description: "Clicking on a server in the user popout navigates to the server",
        type: OptionType.BOOLEAN,
        default: true
    },
    copyMediaOnDiscordUrls: {
        description: "Allows copying media on cdn discord urls",
        type: OptionType.BOOLEAN,
        default: true
    }
});


export default definePlugin({
    name: "randomQOLStuff",
    authors: [{
        name: "Joona",
        id: 297410829589020673n
    }],
    description: "Random QOL stuff",
    patches: [
        {
            find: '"MutualFriendsList"',
            replacement: {
                match: /useState\(!0\)/,
                replace: "useState(!1)"
            },
            predicate: () => settings.store.autoOpenUserDmMutuals
        },
        {
            find: '"text-xs/normal":"text-sm/normal";',
            replacement: [
                {
                    match: /max(Users|Guilds):\d/g,
                    replace: "max$1:Infinity",
                },
                {
                    match: /children:(?=\i\.\i\.Messages)/g,
                    replace: "$&true?null:",
                },
                {
                    match: /\[!\i(?<=MUTUAL_GUILDS.{12,16})/,
                    replace: "[true",
                },
            ],
            predicate: () => settings.store.showAllFriendsAndGuilds
        },
        {
            find: '"text-xs/normal":"text-sm/normal";',
            replacement:
            {
                match: /onClick.{25,30}.MUTUAL_GUILDS\),/,
                replace: "",
            },
            predicate: () => settings.store.ClickServersOnPopout
        },
        {
            find: '"text-xs/normal":"text-sm/normal";',
            replacement: [
                {
                    match: /onClick.{25,30}.MUTUAL_FRIENDS\),/,
                    replace: "",
                },
                /*
                {
                    match: /disableUsernameTooltip:!0/,
                    replace: "disableUsernameTooltip:!1"
                }
                */
            ],
            predicate: () => settings.store.ClickUsersOnPopout
        },
        {
            find: ".AvatarSizes.SIZE_24,hide",
            replacement: [
                {
                    match: /\.avatar,\i\)(?<=getName\((\i).{49,54}),/,
                    replace: "$&onClick:()=>Vencord.Util.openUserProfile($1.id),"
                },
            ],
            predicate: () => settings.store.ClickUsersOnPopout
        },
        {
            find: ".Sizes.SMALLER,hide",
            replacement: [
                {
                    match: /onClick:\i,(?<=guild:(\i),.{9,12})/,
                    replace: "onClick:()=>Vencord.Webpack.Common.NavigationRouter.transitionToGuild($1.id),"
                },
                /*
                {
                    match: /showTooltip:!1/,
                    replace: "showTooltip:!0"
                }
                */
            ],
            predicate: () => settings.store.ClickServersOnPopout
        },
        {
            find: 'id:"copy-image"',
            replacement: [
                {
                    match: /return null!/,
                    replace: "return true || null!"
                }
            ],
            predicate: () => settings.store.copyMediaOnDiscordUrls
        },
    ],
    settings
});
