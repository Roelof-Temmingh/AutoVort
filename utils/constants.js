export const domainSettingsDefault = [
    {
        "name": "Facebook Profile",
        "regex": "(http(s)?:\/\/)?(www.)?facebook.com\/([-a-zA-Z0-9]+)",
        "paths": [
            {
                "path": "/friends/",
                "scrollLength": 25,
            },
            {
                "path": "/photos_all",
            },
            {
                "path": "/photos_of",
            },
            {
                "path": "/videos_of",
            },
            {
                "path": "/videos_by",
            },
            {
                "path": "/about?section=overview",
                "scrollLength": 0,
            },
            {
                "path": "/about?section=education",
                "scrollLength": 0,
            },
            {
                "path": "/about?section=living",
                "scrollLength": 0,
            },
            {
                "path": "/about?section=contact-info",
                "scrollLength": 0,
            },
            {
                "path": "/about?section=relationship",
                "scrollLength": 0,
            },
            {
                "path": "/about?section=bio",
                "scrollLength": 0,
            },
            {
                "path": "/about?section=overviews",
                "scrollLength": 0,
            },
            {
                "path": "/about?section=living",
                "scrollLength": 0,
            }
        ],
    },
    {
        "name": "Linkedin Profile",
        "regex": "(http(s)?:\/\/)?(www.)?linkedin.com\/in\/([-a-zA-Z0-9]+)",
        "paths": [
            {
                "path": "/detail/recent-activity",
            },
            {
                "path": "/detail/contact-info/",
                "scrollLength": 0,
            },
            {
                "path": "/detail/interests/influencers/",
                "scrollLength": 0,
            },
            {
                "path": "/detail/interests/companies/",
                "scrollLength": 0,
            },
            {
                "path": "/detail/interests/groups/",
                "scrollLength": 0,
            },
            {
                "path": "/detail/interests/schools/",
                "scrollLength": 0,
            },
            {
                "path": "/detail/skills/",
                "scrollLength": 0,
            },
        ],
    },
    {
        "name": "Twitter Profile",
        "regex": "(http(s)?:\/\/)?(www.)?twitter.com\/([-a-zA-Z0-9]+)",
        "paths": [
            {
                "path": "/photo",
                "scrollLength": 0,
            },
            {
                "path": "/media",
            },
            {
                "path": "/likes",
            },
            {
                "path": "/with_replies",
            },
        ],
    }
];


export const runSettingsDefault = {
    urlWaitMin: 3,
    urlWaitMax: 5,
    scrollWaitMin: 2,
    scrollWaitMax: 3,
    defaultScrollLength: 5
};
