<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" indent="yes"/>

    <xsl:key name="kCity" match="item" use="@city"/>
    <xsl:key name="kOrg" match="item" use="concat(@city, '+', @org)"/>

    <xsl:template match="/orgs">
        <Root>
            <xsl:for-each select="item[generate-id() = generate-id(key('kCity', @city)[1])]">
                <City name="{@city}">

                    <xsl:for-each select="key('kCity', @city)[generate-id() = generate-id(key('kOrg', concat(@city, '+', @org))[1])]">
                        <Company name="{@org}">

                            <xsl:for-each select="key('kOrg', concat(@city, '+', @org))">
                                <Item title="{@title}" value="{@value}"/>
                            </xsl:for-each>

                        </Company>
                    </xsl:for-each>
                </City>
            </xsl:for-each>
        </Root>
    </xsl:template>
</xsl:stylesheet>