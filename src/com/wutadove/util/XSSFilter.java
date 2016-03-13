package com.wutadove.util;
 
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.owasp.esapi.ESAPI;
 
public class XSSFilter
{ 
    /**
     * Strips any potential XSS threats out of the value
     * @param value
     * @return
     */
    public static String stripXSS( String value )
    {
        if( value == null )
            return null;
     
        // Use the ESAPI library to avoid encoded attacks.
        value = ESAPI.encoder().canonicalize( value );
 
        // Avoid null characters
        value = value.replaceAll("\0", "");
 
        // Clean out HTML
        value = Jsoup.clean( value, Whitelist.none() );
 
        return value;
    }
}