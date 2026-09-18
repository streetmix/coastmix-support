INSERT INTO public."Users"(id,
                           profile_image_url,
                           created_at,
                           updated_at,
                           last_street_id,
                           display_name)
VALUES ('examples',
        'https://res.cloudinary.com/streetmix/image/upload/v1785331734/coastmix/Streetmix_ProfileImage-09.png',
        '2026-08-19 09:00:00+00',
        '2026-08-19 09:00:00+00',
        12,
        'Coastmix Examples')
ON CONFLICT (id)
DO UPDATE
SET profile_image_url = EXCLUDED.profile_image_url,
    created_at = EXCLUDED.created_at,
    updated_at = EXCLUDED.updated_at,
    last_street_id = EXCLUDED.last_street_id,
    display_name = EXCLUDED.display_name;
